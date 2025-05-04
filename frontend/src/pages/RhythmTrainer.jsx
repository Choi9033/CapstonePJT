import React, { useState } from "react";

const RhythmTrainer = () => {
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setFeedback(null);
    setScore(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");

        const res = await fetch("https://fastapi-app-533493952547.us-central1.run.app/api/analyze", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setFeedback(data.feedback || "피드백 없음");
        setScore(data.score || "점수 없음");
        setLoading(false);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 10000); // 10초 녹음
    } catch (err) {
      console.error("❌ 녹음 실패 또는 분석 오류:", err);
      setFeedback("마이크 접근 실패 또는 서버 오류");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>🎵 리듬 분석 시작</h2>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "분석 중..." : "🎙️ 녹음하고 분석하기"}
      </button>
      {score && <p>🧠 분석 점수: <strong>{score}</strong></p>}
      {feedback && <p>🗣️ 피드백: {feedback}</p>}
    </div>
  );
};

export default RhythmTrainer;
