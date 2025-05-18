import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Metronome from './Metronome';
import Tuner from './Tuner';
import AccuracyChart from './AccuracyChart';

const Home = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
        }
      }
    };
    fetchUserName();
  }, []);

  const handleChangeRoutine = () => {
    alert('루틴 변경 기능은 추후 업데이트 예정입니다.');
  };

  const handleUploadRecording = () => {
    alert('녹음 업로드 기능은 추후 업데이트 예정입니다.');
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
      {/* 상단 인사 + 로그아웃 */}
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

      {/* 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 루틴 카드 */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md flex flex-col justify-between transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              🎯 Today’s Routine
            </h2>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Chords: G – D – Em – C</li>
              <li>Strumming Pattern: Down–Downup–Up–Up–Down</li>
              <li>Target Tempo: 90 BPM</li>
            </ul>
          </div>
          <button className="mt-4 bg-yellow-400 text-white text-sm px-4 py-2 rounded-lg hover:bg-yellow-500 transition self-start">
            Start Practice
          </button>
        </div>

        {/* 연습 진행률 카드 */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md flex flex-col justify-between transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              📝 연습 진행률
            </h2>
            <p className="text-sm text-gray-600">이번 주 5일 중 2일 완료</p>
          </div>
          <button className="mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition self-start">
            기록 보기
          </button>
        </div>

        {/* 메트로놈 카드 */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <Metronome />
        </div>

        {/* 튜너 카드 */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <Tuner />
        </div>

        {/* 정확도 차트 카드 - 두 칸 전체로 넓게 */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg">
          <AccuracyChart />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <button
          onClick={handleChangeRoutine}
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition"
        >
          루틴 변경
        </button>
        <button
          onClick={handleUploadRecording}
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition"
        >
          녹음 업로드
        </button>
      </div>
    </main>
  );
};

export default Home;
