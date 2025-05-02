# Model

실행 방법 : target 폴더에 음원을 넣고
generate_features.py 실행시
user파일에 음원 변형본(fast,slow) 생김.
그리고 csv 파일 생성됨.
train_regressor.py를 실행시키려면 csv파일에 수동으로 score 컬럼을 넣고 점수를 매겨줘야함.
일시적으로 원곡은 100, fast는 85, slow 70으로 매겼음.
변동 예정 있음.
현재까지는 정확도 72%