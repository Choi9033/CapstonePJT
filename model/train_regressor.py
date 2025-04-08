import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 1. 데이터 불러오기
df = pd.read_csv("features.csv")

# 2. 피처(X)와 타겟(y) 분리
feature_cols = ["mean_error", "std_error", "bpm_diff", "onset_count_diff", "duration"]
X = df[feature_cols]
y = df["score"]

# 3. 훈련 / 테스트 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. 모델 생성 및 학습
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. 예측 및 평가
y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"📊 평균 제곱 오차 (MSE): {mse:.2f}")
print(f"📈 결정 계수 (R²): {r2:.2f}")

# 6. 예측 vs 실제 시각화
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.8, color='teal')
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--')  # 대각선 (완벽 예측 기준선)
plt.xlabel("실제 점수")
plt.ylabel("예측 점수")
plt.title("🎯 예측 점수 vs 실제 점수")
plt.grid(True)
plt.tight_layout()
plt.show()
