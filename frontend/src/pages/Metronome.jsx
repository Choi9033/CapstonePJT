import React, { useState, useEffect, useRef } from 'react';

const Metronome = () => {
  const [bpm, setBpm] = useState(100);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);
  const clickSound = useRef(new Audio('/click.wav')); // 👉 click.wav는 /public 폴더에 위치

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        clickSound.current.currentTime = 0; // 🔁 소리 중첩 방지
        clickSound.current.play();
      }, (60 / bpm) * 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playing, bpm]);

  // 👉 추후 ML 리듬 예측 기능 추가 예정
  // 예: 박자 감지 후 시각/청각 피드백으로 반응

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">🎵 메트로놈</h2>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          className="flex-1"
        />
        <span className="w-12 text-right text-sm text-gray-600">{bpm} BPM</span>
      </div>
      <button
        onClick={() => setPlaying(!playing)}
        className={`mt-4 w-full py-2 rounded-md font-semibold transition ${
          playing ? 'bg-red-400 text-white' : 'bg-yellow-400 text-white'
        } hover:opacity-90`}
      >
        {playing ? '정지' : '시작'}
      </button>
      <p className="text-xs text-gray-400 mt-2">
        * 리듬 분석 및 피드백 기능은 추후 머신러닝으로 적용 예정
      </p>
    </div>
  );
};

export default Metronome;
