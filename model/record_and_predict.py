
import sounddevice as sd
import soundfile as sf
import librosa
import numpy as np
import joblib
import os
import openai
import json
import os


# === 설정 ===
TARGET_AUDIO_PATH = "samples/target/song_target.wav"
USER_RECORDING_PATH = "user_recording.wav"
MODEL_PATH = "model.pkl"
DURATION = 10  # 녹음 시간 (초)
SR = 22050  # 샘플링 레이트
openai.api_key = os.getenv("OPENAI_API_KEY")  # 또는 직접 문자열로 키 입력

# === 무음 체크 ===
def is_silent(file_path, threshold=0.01):
    y, _ = librosa.load(file_path)
    peak = np.max(np.abs(y))
    print(f"[디버그] 녹음된 peak amplitude: {peak}")
    return peak < threshold

# === 1. 녹음 ===
def record_audio():
    print("🎤 [녹음 시작] 10초 동안 기타를 연주하세요!")
    recording = sd.rec(int(DURATION * SR), samplerate=SR, channels=1)
    sd.wait()
    sf.write(USER_RECORDING_PATH, recording, SR)
    print(f"✅ 녹음 완료: {USER_RECORDING_PATH}")

# === 2. 피처 추출 ===
def extract_features(user_path, target_path):
    y_user, sr_user = librosa.load(user_path)
    y_target, sr_target = librosa.load(target_path)

    user_onsets = librosa.onset.onset_detect(y=y_user, sr=sr_user, units='time')
    target_onsets = librosa.onset.onset_detect(y=y_target, sr=sr_target, units='time')

    if len(user_onsets) < 2:
        print("⚠️ 연주가 거의 감지되지 않았습니다. 다시 시도해주세요.")
        exit()

    paired = zip(user_onsets[:len(target_onsets)], target_onsets)
    errors = [abs(u - t) for u, t in paired]
    mean_error = np.mean(errors) if errors else 0
    std_error = np.std(errors) if errors else 0
    onset_diff = len(user_onsets) - len(target_onsets)

    bpm_user = librosa.beat.tempo(y=y_user, sr=sr_user)[0]
    bpm_target = librosa.beat.tempo(y=y_target, sr=sr_target)[0]
    bpm_diff = bpm_user - bpm_target

    duration = librosa.get_duration(y=y_user, sr=sr_user)

    return [mean_error, std_error, bpm_diff, onset_diff, duration]

# === 3. 점수 예측 ===
def predict_score(features):
    model = joblib.load(MODEL_PATH)
    score = model.predict([features])[0]
    return round(score, 2)

# === 4. GPT 피드백용 JSON 생성 ===
def build_gpt_input_json(score, user_path, target_path, threshold=0.1):
    y_user, sr_user = librosa.load(user_path)
    y_target, sr_target = librosa.load(target_path)

    user_onsets = librosa.onset.onset_detect(y=y_user, sr=sr_user, units='time')
    target_onsets = librosa.onset.onset_detect(y=y_target, sr=sr_target, units='time')

    min_len = min(len(user_onsets), len(target_onsets))
    user_onsets = user_onsets[:min_len]
    target_onsets = target_onsets[:min_len]

    timing_errors = []
    for i in range(min_len):
        u = user_onsets[i]
        t = target_onsets[i]
        err = abs(u - t)
        if err >= threshold:
            timing_errors.append({
                "index": i + 1,
                "target_time": round(t, 2),
                "user_time": round(u, 2),
                "error": round(err, 3)
            })

    return {
        "score": score,
        "timing_errors": timing_errors
    }

# === 5. GPT 피드백 생성 ===
def generate_gpt_feedback(gpt_input):
    prompt = f"""
다음은 기타 연주 분석 결과입니다:

{json.dumps(gpt_input, indent=2, ensure_ascii=False)}

이 정보를 바탕으로 연주자에게 친절하고 구체적인 리듬 피드백을 1문단으로 작성해주세요.
"""
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message["content"].strip()

# === 실행 ===
if __name__ == "__main__":
    if not os.path.exists(TARGET_AUDIO_PATH):
        print(f"❌ 정답 오디오가 없습니다: {TARGET_AUDIO_PATH}")
        exit()

    if not os.path.exists(MODEL_PATH):
        print("❌ model.pkl 파일이 없습니다. 먼저 모델을 학습하고 저장하세요.")
        exit()

    record_audio()

    if is_silent(USER_RECORDING_PATH):
        print("⚠️ 소리가 감지되지 않았습니다. 기타를 연주하고 다시 시도해주세요!")
        exit()

    features = extract_features(USER_RECORDING_PATH, TARGET_AUDIO_PATH)
    score = predict_score(features)

    print(f"\n🎯 예측 점수: {score}점")

    gpt_input = build_gpt_input_json(score, USER_RECORDING_PATH, TARGET_AUDIO_PATH)
    gpt_feedback = generate_gpt_feedback(gpt_input)

    print(f"🧠 GPT 피드백:\n{gpt_feedback}")

