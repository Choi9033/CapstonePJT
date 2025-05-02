from fastapi import Request
from fastapi.responses import JSONResponse

# 표준 기타 튜닝 (EADGBE)
STANDARD_TUNING = {
    'E2': 82.41,
    'A2': 110.00,
    'D3': 146.83,
    'G3': 196.00,
    'B3': 246.94,
    'E4': 329.63
}

async def analyze_pitch_api(request: Request):
    try:
        data = await request.json()
        freq = float(data.get("frequency", 0.0))

        note, standard_freq = min(STANDARD_TUNING.items(), key=lambda x: abs(x[1] - freq))
        difference = freq - standard_freq

        result_message = f"감지된 주파수: {freq:.2f} Hz\n가장 가까운 음: {note} ({standard_freq:.2f} Hz)"
        if abs(difference) < 1.0:
            result_message += "\n튜닝 완료! 🎸"
        elif difference > 0:
            result_message += "\n조금 낮추세요 (Flat)"
        else:
            result_message += "\n조금 올리세요 (Sharp)"

        return JSONResponse(content={"message": result_message})

    except Exception as e:
        return JSONResponse(content={"message": f"서버 오류: {str(e)}"}, status_code=500)
