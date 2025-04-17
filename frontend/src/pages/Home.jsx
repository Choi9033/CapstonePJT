import React from 'react';
import Sidebar from './Sidebar';
import RoutineCard from './RoutineCard';
import Metronome from './Metronome';
import Tuner from './Tuner';
import AccuracyChart from './AccuracyChart';

const Home = () => {
  const handleChangeRoutine = () => {
    alert('루틴 변경 기능은 추후 업데이트 예정입니다.');
  };

  const handleUploadRecording = () => {
    alert('녹음 업로드 기능은 추후 업데이트 예정입니다.');
  };

  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
    // 실제 로그아웃 로직은 나중에 추가
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-1">
              Hello, Yuna <span>🎸</span>
            </h1>
            <p className="text-gray-500">오늘의 연습을 시작해볼까요?</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200"
          >
            로그아웃
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoutineCard />
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">연습 진행률</h2>
            <p className="text-sm text-gray-500">이번 주 5일 중 2일 완료</p>
            <button className="mt-3 border border-blue-500 text-blue-500 px-4 py-1 rounded text-sm hover:bg-blue-50">
              기록 보기
            </button>
          </div>
          <Metronome />
          <Tuner />
          <AccuracyChart />
        </div>

        <div className="flex flex-col sm:flex-row justify-start gap-4 mt-8">
          <button
            onClick={handleChangeRoutine}
            className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            루틴 변경
          </button>
          <button
            onClick={handleUploadRecording}
            className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            녹음 업로드
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
