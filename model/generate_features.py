import librosa
import numpy as np
import csv
import os

target_dir = "samples/target/"
user_dir = "samples/user/"
output_csv = "features.csv"

def extract_features(user_path, target_path):
    y_user, sr_user = librosa.load(user_path)
    y_target, sr_target = librosa.load(target_path)

    # 온셋 추출
    user_onsets = librosa.onset.onset_detect(y=y_user, sr=sr_user, units='time')
    target_onsets = librosa.onset.onset_detect(y=y_target, sr=sr_target, units='time')

    # 온셋 오차 계산
    paired = zip(user_onsets[:len(target_onsets)], target_onsets)
    errors = [abs(u - t) for u, t in paired]
    mean_error = np.mean(errors) if errors else 0
    std_error = np.std(errors) if errors else 0
    onset_diff = len(user_onsets) - len(target_onsets)

    # BPM 차이
    bpm_user = librosa.beat.tempo(y=y_user, sr=sr_user)[0]
    bpm_target = librosa.beat.tempo(y=y_target, sr=sr_target)[0]
    bpm_diff = bpm_user - bpm_target

    duration = librosa.get_duration(y=y_user, sr=sr_user)

    return {
        "user_file": os.path.basename(user_path),
        "mean_error": mean_error,
        "std_error": std_error,
        "bpm_diff": bpm_diff,
        "onset_count_diff": onset_diff,
        "duration": duration
    }

# 실행
with open(output_csv, "w", newline="") as csvfile:
    fieldnames = ["user_file", "mean_error", "std_error", "bpm_diff", "onset_count_diff", "duration"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for user_file in os.listdir(user_dir):
        if user_file.endswith(".wav"):
            # user 파일 이름에서 base 추출
            base_name = user_file.replace("_user_slow.wav", "").replace("_user_fast.wav", "")
            target_candidates = [f for f in os.listdir(target_dir) if base_name in f]

            if not target_candidates:
                print(f"❌ 타겟 없음: {user_file}")
                continue

            user_path = os.path.join(user_dir, user_file)
            target_path = os.path.join(target_dir, target_candidates[0])  # 첫 번째 매칭되는 정답 사용

            try:
                features = extract_features(user_path, target_path)
                writer.writerow(features)
                print(f"✅ 피처 저장: {user_file}")
            except Exception as e:
                print(f"❌ 오류 발생: {user_file} - {e}")
