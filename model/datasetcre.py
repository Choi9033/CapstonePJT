import librosa
import soundfile as sf
import os

target_dir = 'samples/target/'
user_dir = 'samples/user/'

def create_user_versions(target_path, user_slow_path, user_fast_path):
    y, sr = librosa.load(target_path)
    y_slow = librosa.effects.time_stretch(y, rate=0.95)
    y_fast = librosa.effects.time_stretch(y, rate=1.05)
    sf.write(user_slow_path, y_slow, sr)
    sf.write(user_fast_path, y_fast, sr)

for filename in os.listdir(target_dir):
    if filename.endswith('.wav'):
        base_name = os.path.splitext(filename)[0]
        target_path = os.path.join(target_dir, filename)

        user_slow_path = os.path.join(user_dir, f"{base_name}_user_slow.wav")
        user_fast_path = os.path.join(user_dir, f"{base_name}_user_fast.wav")

        try:
            create_user_versions(target_path, user_slow_path, user_fast_path)
            print(f"✅ 생성 완료: {base_name}")
        except Exception as e:
            print(f"❌ 오류 발생: {base_name} - {e}")
