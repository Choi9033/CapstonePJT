import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const SONG_LIST = [
  { id: "first_love", name: "🎶 백아 - 첫사랑", image: "/first_love.jpg" },
  { id: "youth", name: "🎤 김필 - 청춘", image: "/youth.jpg" },
  { id: "you_and_i", name: "🚴‍♀️ 너에게 난 나에게 넌", image: "/you_and_i.jpg" },
];

const RhythmTrainer = () => {
  const [selectedSong, setSelectedSong] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [timingErrors, setTimingErrors] = useState([]);
  const [userId, setUserId] = useState(null);

  // 로그인 사용자 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

 const handleToggleRecord = async () => {
  if (!selectedSong) {
    alert("🎼 곡을 먼저 선택해주세요!");
    return;
  }
  if (!userId) {
    alert("🔒 로그인 후 사용 가능합니다.");
    return;
  }

  if (!recording) {
    // 이전 인터벌 정리
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setRecordingTime(0);
    setFeedback(null);
    setScore(null);
    setTimingErrors([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const newChunks = [];

      recorder.ondataavailable = (e) => newChunks.push(e.data);

      recorder.onstop = async () => {
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
        setRecording(false);
        setRecordingTime(0);
        setLoading(true);

        const blob = new Blob(newChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");
        formData.append("song", selectedSong);
        formData.append("user_id", userId);

        try {
          const res = await fetch("https://fastapi-app-533493952547.us-central1.run.app/api/analyze", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          setFeedback(data.feedback || "피드백 없음");
          setScore(data.score !== undefined ? data.score : "점수 없음");
          setTimingErrors(data.timing_errors || []);
        } catch (err) {
          console.error("❌ 분석 요청 실패:", err);
          setFeedback("서버 오류 또는 분석 실패");
          setScore("점수 없음");
        }

        setChunks([]);
        setLoading(false);
      };

      recorder.start();
      const id = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
      setIntervalId(id);
      setMediaRecorder(recorder);
      setChunks(newChunks);
      setRecording(true);
    } catch (err) {
      console.error("❌ 마이크 접근 실패:", err);
      setFeedback("마이크 접근 실패");
    }
  } else {
    // 녹음 종료 처리
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop();
    }
  }
};


  // 시각화 구성
  const renderBarChart = () => {
    if (timingErrors.length === 0) return null;

    const data = {
      labels: timingErrors.map((e) => `구간 ${e.index}`),
      datasets: [
        {
          label: "리듬 오차 (초)",
          data: timingErrors.map((e) => e.error),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "오차 (초)",
          },
        },
      },
    };

    return (
      <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <h3>📊 구간별 리듬 오차</h3>
        <Bar data={data} options={options} />
        <p style={{ marginTop: "0.5rem", color: "#555" }}>
          📌 오차가 클수록 막대가 높아집니다. (단위: 초)
        </p>
      </div>
    );
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

      <button onClick={handleToggleRecord} disabled={loading}>
        {recording ? "🛑 녹음 종료" : loading ? "🔄 분석 중..." : "🎙️ 녹음 시작"}
      </button>

      {recording && (
        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          ⏱️ 녹음 중... <strong>{recordingTime}</strong>초
        </p>
      )}

      {selectedSong && <p style={{ marginTop: "1rem" }}>📌 선택한 곡: <strong>{selectedSong}</strong></p>}
      {score && <p>🧠 분석 점수: <strong>{score}</strong></p>}
      {feedback && <p>🗣️ 피드백: {feedback}</p>}

      {renderBarChart()}
    </div>
  );
};

export default RhythmTrainer;
