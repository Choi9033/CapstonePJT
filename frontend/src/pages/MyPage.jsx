import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
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

const MyPage = () => {
  const [userId, setUserId] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sessions, setSessions] = useState([]);

  // 🔐 로그인 사용자 UID 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // 📥 Firestore 세션 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const q = query(
          collection(db, "users", userId, "sessions"),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSessions(data);
      } catch (err) {
        console.error("❌ Firestore 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [userId]);

  // 📊 평균 계산 함수
  const avg = (arr) =>
    arr.length === 0 ? 0 : (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);

  // 📊 차트 데이터 구성
  const scoreChart = {
    labels: sessions.map((s, i) => `#${sessions.length - i} - ${s.song}`),
    datasets: [
      {
        label: "점수",
        data: sessions.map((s) => s.score),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // 🔐 로그인 확인 중
  if (!authChecked) {
    return <p className="p-10 text-center">🔄 로그인 상태 확인 중...</p>;
  }

  // 🔒 로그인 안 됐을 때
  if (!userId) {
    return (
      <div className="p-10 text-center">
        <p>🔒 마이페이지는 로그인 후 이용할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">👤 마이페이지</h1>

      {sessions.length === 0 ? (
        <p>📭 아직 분석 기록이 없습니다.</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">📈 점수 히스토리</h2>
            <Bar data={scoreChart} />
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">📊 요약 통계</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>총 분석 횟수: {sessions.length}회</li>
              <li>평균 점수: {avg(sessions.map((s) => s.score))}</li>
              <li>평균 BPM 차이: {avg(sessions.map((s) => s.bpm_diff || 0))}</li>
              <li>평균 연주 시간: {avg(sessions.map((s) => s.duration || 0))}초</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">🗣️ 최근 피드백</h2>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {sessions.slice(0, 3).map((s) => (
                <li key={s.id}>
                  [{new Date(s.timestamp?.seconds * 1000).toLocaleString()}]{" "}
                  <strong>{s.song}</strong> – {s.feedback}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default MyPage;
