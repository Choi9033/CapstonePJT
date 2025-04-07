import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from guitar_tuner import analyze_pitch_api

app = FastAPI()

# CORS 허용 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 경로 설정 (Docker 내 /app/public 기준)
static_dir = os.path.join(os.path.dirname(__file__), "public")
app.mount("/static", StaticFiles(directory=static_dir, html=True), name="static")

# 루트 경로에서 index.html 제공
@app.get("/")
def serve_index():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/favicon.ico")
def serve_favicon():
    return FileResponse(os.path.join(static_dir, "favicon.ico"))

@app.get("/index.html")
def serve_index_html():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/guitar_tuner.html")
def serve_guitar_tuner():
    return FileResponse(os.path.join(static_dir, "guitar_tuner.html"))

# 기타 튜너 API 엔드포인트
app.add_api_route("/api/analyze_pitch", analyze_pitch_api, methods=["POST"])
