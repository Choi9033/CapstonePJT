import React, { useEffect, useRef, useState } from 'react';
import PitchFinder from 'pitchfinder';

const Tuner = () => {
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const bufferRef = useRef(new Float32Array(2048));
  const detector = useRef(PitchFinder.YIN()); // 👉 추후 ML 모델로 교체 예정

  useEffect(() => {
    const startTuner = async () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);

        const detectPitch = () => {
          analyserRef.current.getFloatTimeDomainData(bufferRef.current);

          // 👉 현재는 YIN 알고리즘으로 추정. 추후 ML 모델로 변경 예정
          const pitch = detector.current(bufferRef.current);
          if (pitch) {
            setFrequency(pitch.toFixed(2));
            setNote(getNote(pitch));
          }

          requestAnimationFrame(detectPitch);
        };

        detectPitch();
      } catch (err) {
        console.error('🎙️ 마이크 접근 실패:', err);
      }
    };

    startTuner();
  }, []);

  const getNote = (frequency) => {
    const noteNames = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    const noteNumber = 12 * (Math.log(frequency / 440) / Math.log(2));
    const index = Math.round(noteNumber) + 69;
    return noteNames[index % 12];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">🎸 튜너</h2>
      <p className="text-sm text-gray-600">
        현재 음: <strong>{note || '-'}</strong>
      </p>
      <p className="text-sm text-gray-600">
        주파수: <strong>{frequency || '-'} Hz</strong>
      </p>
      <p className="text-xs text-gray-400 mt-2">
        * 머신러닝 기반 분석 기능은 추후 적용 예정
      </p>
    </div>
  );
};

export default Tuner;
