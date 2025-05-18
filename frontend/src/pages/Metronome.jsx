import React, { useState, useRef, useEffect } from 'react';

const Metronome = () => {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const clickRef = useRef(new Audio('/click.mp3'));
  const intervalIdRef = useRef(null);

  const startMetronome = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = setInterval(() => {
      const click = clickRef.current;
      click.currentTime = 0;
      click.play().catch((e) => {
        console.warn('브라우저 자동 재생 차단:', e);
      });
    }, (60 / bpm) * 1000);
  };

  const stopMetronome = () => {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  };

  useEffect(() => {
    if (isPlaying) startMetronome();
    else stopMetronome();

    return () => stopMetronome(); // 언마운트 시 정리
  }, [isPlaying, bpm]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">🎵 메트로놈</h2>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-12 text-right text-sm text-gray-600">{bpm} BPM</span>
      </div>
      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        className={`mt-4 w-full py-2 rounded-md font-semibold transition ${
          isPlaying ? 'bg-red-400 text-white' : 'bg-yellow-400 text-white'
        } hover:opacity-90`}
      >
        {isPlaying ? '정지' : '시작'}
      </button>
    </div>
  );
};

export default Metronome;
