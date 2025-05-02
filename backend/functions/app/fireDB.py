from fastapi import APIRouter
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore

# Firebase 초기화 (중복 초기화 방지)
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
router = APIRouter()

# 데이터 모델
class Message(BaseModel):
    name: str
    message: str
@router.get("/firestore-test")
async def test_firestore():
    try:
        db.collection("connect-test").add({"status": "ok"})
        return {"status": "Firestore 연결 성공!"}
    except Exception as e:
        return {"error": str(e)}


# 저장 API
@router.post("/save")
async def save_message(data: Message):
    doc_ref = db.collection("messages").document()
    doc_ref.set({
        "name": data.name,
        "message": data.message,
    })
    return {"status": "success"}
