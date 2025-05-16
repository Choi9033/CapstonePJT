import React, { useState } from "react";

const SONG_LIST = [
  {
    id: "first_love",
    name: "🎶 백아 - 첫사랑",
    image: "/first_love.jpg", // ✅ public에 직접 넣고 이렇게 접근
  },
  {
    id: "youth",
    name: "🎤 김필 - 청춘",
    image: "/youth.jpg",
  },
  {
    id: "you_and_i",
    name: "🚴‍♀️ 너에게 난 나에게 넌",
    image: "/you_and_i.jpg",
  },
];

const RhythmTrainer = () => {
  const [selectedSong, setSelectedSong] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedSong) {
      alert("🎼 곡을 먼저 선택해주세요!");
      return;
    }

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
        formData.append("song", selectedSong);

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
      setTimeout(() => mediaRecorder.stop(), 10000);
    } catch (err) {
      console.error("❌ 녹음 실패 또는 분석 오류:", err);
      setFeedback("마이크 접근 실패 또는 서버 오류");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h2>🎼 리듬 곡 선택</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {SONG_LIST.map((song) => (
          <div
            key={song.id}
            onClick={() => setSelectedSong(song.id)}
            style={{
              border: selectedSong === song.id ? "3px solid #4caf50" : "1px solid #ccc",
              borderRadius: "10px",
              padding: "0.5rem",
              cursor: "pointer",
              width: "150px",
              textAlign: "center",
              boxShadow: selectedSong === song.id ? "0 0 10px #4caf50" : "none",
              transition: "0.2s",
            }}
          >
            <img src={song.image} alt={song.name} style={{ width: "100%", borderRadius: "8px" }} />
            <p>{song.name}</p>
          </div>
        ))}
      </div>

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "🔍 분석 중..." : "🎙️ 녹음하고 분석하기"}
      </button>

      {selectedSong && <p style={{ marginTop: "1rem" }}>📌 선택한 곡: <strong>{selectedSong}</strong></p>}
      {score && <p>🧠 분석 점수: <strong>{score}</strong></p>}
      {feedback && <p>🗣️ 피드백: {feedback}</p>}
    </div>
  );
};

export default RhythmTrainer;
