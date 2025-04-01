import librosa
import numpy as np
import sys
import os

def load_audio(path):
    y, sr = librosa.load(path)
    return y, sr

def extract_onsets(y, sr):
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
    onset_times = librosa.frames_to_time(onset_frames, sr=sr)
    return onset_times

def trim_audio_to_first_onset(y, sr, onset_times):
    if len(onset_times) == 0:
        return y  # onset이 없으면 자르지 않음
    start_sample = int(onset_times[0] * sr)
    return y[start_sample:]

def compare_onsets(user_onsets, target_onsets, tolerance=0.1):
    matched = 0
    for t in target_onsets:
        if any(abs(t - u) < tolerance for u in user_onsets):
            matched += 1
    return matched / len(target_onsets) if len(target_onsets) > 0 else 0

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("사용법: python rhythm_analysis.py 사용자오디오.wav 정답오디오.wav")
        sys.exit(1)

    user_path = sys.argv[1]
    target_path = sys.argv[2]

    if not os.path.exists(user_path) or not os.path.exists(target_path):
        print("[!] 오디오 파일을 찾을 수 없습니다.")
        sys.exit(1)

    # 오디오 로딩
    user_y, user_sr = load_audio(user_path)
    target_y, target_sr = load_audio(target_path)

    # 온셋 추출
    user_onsets = extract_onsets(user_y, user_sr)
    target_onsets = extract_onsets(target_y, target_sr)

    # 자동 동기화 (onset 기준 앞부분 잘라내기)
    user_y_trimmed = trim_audio_to_first_onset(user_y, user_sr, user_onsets)
    target_y_trimmed = trim_audio_to_first_onset(target_y, target_sr, target_onsets)

    # 자른 오디오로 다시 onset 추출
    user_onsets_trimmed = extract_onsets(user_y_trimmed, user_sr)
    target_onsets_trimmed = extract_onsets(target_y_trimmed, target_sr)

    # 정확도 계산
    accuracy = compare_onsets(user_onsets_trimmed, target_onsets_trimmed)
    print(f"\n🎯 리듬 정확도 (시작 정렬 적용됨): {accuracy*100:.2f}%")
