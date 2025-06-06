import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Metronome from './Metronome';
import Tuner from './Tuner';
import RoutineCard from './RoutineCard';
import ProgressCard from './ProgressCard';
import PracticeTrackPlayer from './PracticeTrackPlayer';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [completedDays, setCompletedDays] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [speakingRatio, setSpeakingRatio] = useState(0);

  const audioRef = useRef(null);
  const speakingDurationRef = useRef(0); // 실제 말한 시간
  const maxDuration = 10; // 최대 표시 시간 (10초)

  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const markTodayComplete = async () => {
    const today = new Date().getDay();
    if (completedDays.includes(today)) return;
    const updated = [...completedDays, today];
    setCompletedDays(updated);

    if (userId) {
      const docRef = doc(db, 'users', userId);
      try {
        await updateDoc(docRef, { completedDays: updated });
      } catch (e) {
        console.error('🔥 Firestore 업데이트 실패:', e);
      }
    }
  };

  useEffect(() => {
    let animationId;

    const startListening = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      const dataArray = new Uint8Array(analyser.fftSize);
      source.connect(analyser);

      const checkVolume = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const volume = Math.sqrt(sum / dataArray.length);

        if (volume > 0.01 * sensitivity) {
          speakingDurationRef.current = Math.min(speakingDurationRef.current + 0.2, maxDuration);
        } else {
          speakingDurationRef.current = Math.max(speakingDurationRef.current - 0.2, 0);
        }

        setSpeakingRatio(speakingDurationRef.current / maxDuration);
        animationId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
      audioRef.current = { audioContext, stream, animationId };
    };

    startListening();

    return () => {
      if (audioRef.current) {
        audioRef.current.stream.getTracks().forEach((track) => track.stop());
        if (
          audioRef.current.audioContext &&
          audioRef.current.audioContext.state !== 'closed'
        ) {
          audioRef.current.audioContext.close();
        }
        cancelAnimationFrame(audioRef.current.animationId);
      }
    };
  }, [sensitivity]);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-yellow-500">
            Hello, {userName || '뮤지션'} 🎸
          </h1>
          <p className="text-gray-600 mt-2 text-base">오늘의 연습을 시작해볼까요?</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition"
        >
          로그아웃
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition">
          <RoutineCard onComplete={markTodayComplete} />
        </div>

        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition">
          <ProgressCard completedDays={completedDays} />
        </div>

        <div
          onClick={() => navigate('/metronome')}
          className="cursor-pointer p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition"
        >
          <Metronome />
        </div>

        <div
          onClick={() => navigate('/tuner')}
          className="cursor-pointer p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition"
        >
          <Tuner />
        </div>

        {/* 🎚 감도 조절 & 시각화 통합 */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition">
          <h2 className="text-lg font-semibold mb-4">입력 감도</h2>
          <p className="text-sm text-gray-700 mb-2">
            감도: {(sensitivity * 100).toFixed(0)}%
          </p>

          <div className="relative w-full h-3 rounded-full bg-yellow-100 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-yellow-400 pointer-events-none transition-all duration-100"
              style={{ width: `${Math.min(speakingRatio * 50, 100)}%` }}
            ></div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="absolute top-1/2 w-4 h-4 rounded-full bg-white border border-gray-400 shadow"
              style={{
                left: `${((sensitivity - 0.1) / 1.9) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md transition">
          <PracticeTrackPlayer />
        </div>
      </div>
    </main>
  );
};

export default Home;
