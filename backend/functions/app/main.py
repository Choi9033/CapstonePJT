import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from guitar_tuner import analyze_pitch_api
from fireDB import router as firedb_router  # ✅ 여기서 라우터 import

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔗 fireDB 라우터 포함
app.include_router(firedb_router)

# 정적 파일 서빙
static_dir = os.path.join(os.path.dirname(__file__), "public")
app.mount("/static", StaticFiles(directory=static_dir, html=True), name="static")

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/index.html")
def serve_index_html():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/guitar_tuner.html")
def serve_guitar_tuner():
    return FileResponse(os.path.join(static_dir, "guitar_tuner.html"))

@app.get("/test.html")
def serve_test():
    return FileResponse(os.path.join(static_dir, "test.html"))

@app.get("/favicon.ico")
def serve_favicon():
    return FileResponse(os.path.join(static_dir, "favicon.ico"))

# 기타 튜너 API
app.add_api_route("/api/analyze_pitch", analyze_pitch_api, methods=["POST"])
