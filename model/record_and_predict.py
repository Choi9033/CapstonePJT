import sounddevice as sd
import soundfile as sf
import librosa
import numpy as np
import joblib
import os

# === 설정 ===
TARGET_AUDIO_PATH = "samples/target/song_target.wav"
USER_RECORDING_PATH = "user_recording.wav"
MODEL_PATH = "model.pkl"
DURATION = 10  # 녹음 시간 (초)
SR = 22050  # 샘플링 레이트

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

# === 4. 피드백 생성 ===
def generate_feedback(score):
    if score >= 90:
        return "완벽에 가까운 연주입니다! 리듬이 매우 정확해요 🎯"
    elif score >= 75:
        return "좋은 연주입니다. 리듬이 안정적입니다 😊"
    elif score >= 60:
        return "조금 더 박자에 집중해서 연습해보세요 ⏱️"
    else:
        return "리듬이 많이 흔들려요. 메트로놈과 함께 연습해보세요 🔁"
    
def extract_timing_errors(user_path, target_path, threshold=0.1):
    y_user, sr_user = librosa.load(user_path)
    y_target, sr_target = librosa.load(target_path)

    user_onsets = librosa.onset.onset_detect(y=y_user, sr=sr_user, units='time')
    target_onsets = librosa.onset.onset_detect(y=y_target, sr=sr_target, units='time')

    min_len = min(len(user_onsets), len(target_onsets))
    user_onsets = user_onsets[:min_len]
    target_onsets = target_onsets[:min_len]

    results = []
    for i in range(min_len):
        u = user_onsets[i]
        t = target_onsets[i]
        err = abs(u - t)
        if err >= threshold:
            results.append({
                "index": i + 1,
                "target_time": round(t, 2),
                "user_time": round(u, 2),
                "error": round(err, 3)
            })
    return results


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
    feedback = generate_feedback(score)

    print(f"\n🎯 예측 점수: {score}점")
    print(f"📢 피드백: {feedback}")

    # 구간별 오차 출력
    print("\n🧠 구간별 박자 오차가 큰 부분:")
    timing_errors = extract_timing_errors(USER_RECORDING_PATH, TARGET_AUDIO_PATH)
    if not timing_errors:
        print("👍 전체적으로 정확하게 연주되었습니다!")
    else:
        for e in timing_errors:
            print(f"{e['index']}번째 음표 | 예상: {e['target_time']}초 / 실제: {e['user_time']}초 → 오차: {e['error']}초")