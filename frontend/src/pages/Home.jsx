import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Metronome from './Metronome';
import Tuner from './Tuner';
import AccuracyChart from './AccuracyChart';
import RoutineCard from './RoutineCard';
import { updateDoc } from 'firebase/firestore';
import ProgressCard from './ProgressCard';
import { useMicSensitivity } from '../contexts/MicSensitivityContext';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [completedDays, setCompletedDays] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { sensitivity, setSensitivity } = useMicSensitivity();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserName(docSnap.data().name);
            setCompletedDays(docSnap.data().completedDays || []);
            setUserId(user.uid);
          }
        } catch (error) {
          console.error('Firestore 접근 오류:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChangeRoutine = () => {
    alert('루틴 변경 기능은 추후 업데이트 예정입니다.');
  };

  const handleUploadRecording = () => {
    alert('녹음 업로드 기능은 추후 업데이트 예정입니다.');
  };

  const markTodayComplete = async () => {
    const today = new Date().getDay(); // 0 ~ 6

    // 이미 완료한 날이면 무시
    if (completedDays.includes(today)) return;

    const updated = [...completedDays, today];
    setCompletedDays(updated); // UI에 즉시 반영

    if (userId) {
      const docRef = doc(db, 'users', userId);
      try {
        await updateDoc(docRef, {
          completedDays: updated,
        });
      } catch (e) {
        console.error('🔥 Firestore 업데이트 실패:', e);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      {/* 상단 인사말 + 로그아웃 */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-yellow-500">
            Hello, {userName || '뮤지션'} 🎸
          </h1>
          <p className="text-gray-600 mt-2 text-base">
            오늘의 연습을 시작해볼까요?
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition"
        >
          로그아웃
        </button>
      </div>

      {/* 카드 UI 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 루틴 카드 */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <RoutineCard onComplete={markTodayComplete} />
        </div>

        {/* 연습 진행률 카드 */}
        <div className="cursor-pointer p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <ProgressCard />
        </div>

        {/* 메트로놈 카드 */}
        <div
          onClick={() => navigate('/metronome')}
          className="cursor-pointer p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg"
        >
          <Metronome />
        </div>

        {/* 튜너 카드 */}
        <div
          onClick={() => navigate('/tuner')}
          className="cursor-pointer p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg"
        >
          <Tuner />
        </div>

        {/* 정확도 차트 카드 */}
        <div
          onClick={() => navigate('/accuracy')}
          className="cursor-pointer p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg"
        >
          <AccuracyChart />
        </div>

        {/* 🎚 마이크 감도 카드 */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-4">🎚 마이크 감도</h2>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-2 text-right">
            감도: {(sensitivity * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </main>
  );
};

export default Home;
