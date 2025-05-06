import React, { useEffect, useRef, useState } from 'react';
import PitchFinder from 'pitchfinder';

const Tuner = () => {
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const bufferRef = useRef(new Float32Array(2048));
  const detector = useRef(PitchFinder.YIN());
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  const startTuner = async () => {
    try {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);

      intervalRef.current = setInterval(() => {
        analyserRef.current.getFloatTimeDomainData(bufferRef.current);
        const pitch = detector.current(bufferRef.current);
        if (pitch) {
          setFrequency(pitch.toFixed(2));
          setNote(getNote(pitch));
        }
      }, 200);
    } catch (err) {
      console.error('🎙️ 마이크 접근 실패:', err);
    }
  };

  const stopTuner = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setFrequency(null);
    setNote('');
  };

  useEffect(() => {
    if (isListening) {
      startTuner();
    } else {
      stopTuner();
    }

    return () => stopTuner();
  }, [isListening]);

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

      <button
        onClick={() => setIsListening((prev) => !prev)}
        className={`mt-4 w-full py-2 rounded-md font-semibold transition ${
          isListening ? 'bg-red-400 text-white' : 'bg-yellow-400 text-white'
        } hover:opacity-90`}
      >
        {isListening ? '정지' : '듣기 시작'}
      </button>
    </div>
  );
};

export default Tuner;
