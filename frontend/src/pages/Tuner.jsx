import React, { useRef, useState, useEffect } from 'react';
import { useMicSensitivity } from '../contexts/MicSensitivityContext';

const Tuner = () => {
  const [note, setNote] = useState('-');
  const [frequency, setFrequency] = useState('-');
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { sensitivity } = useMicSensitivity();

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const intervalIdRef = useRef(null);
  const lastPitchRef = useRef(null);
  const streamRef = useRef(null);

  const API_BASE_URL = 'https://fastapi-app-533493952547.us-central1.run.app';

  useEffect(() => {
    return () => {
      stopTuning();
    };
  }, []);

  const startTuning = async () => {
    try {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') return;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const microphone = audioCtx.createMediaStreamSource(stream);
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = sensitivity;

      analyserRef.current = audioCtx.createAnalyser();
      analyserRef.current.fftSize = 2048;

      microphone.connect(gainNode);
      gainNode.connect(analyserRef.current);

      const bufferLength = analyserRef.current.fftSize;
      dataArrayRef.current = new Float32Array(bufferLength);

      intervalIdRef.current = setInterval(detectPitch, 200);
      setIsListening(true);
      setMessage('듣기 시작!');
    } catch (err) {
      console.error('🎤 마이크 접근 실패:', err);
      setMessage('마이크 접근 실패');
      setIsListening(false);
    }
  };

  const stopTuning = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsListening(false);
    setMessage('튜너 중지됨');
    setFrequency('-');
    setNote('-');
  };

  const detectPitch = async () => {
    if (!analyserRef.current || !dataArrayRef.current || !audioContextRef.current) return;

    analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);
    const pitch = autoCorrelate(dataArrayRef.current, audioContextRef.current.sampleRate);
    if (pitch === -1 || pitch > 10000) return;

    setFrequency(pitch.toFixed(2));
    setNote(getNote(pitch));

    if (
      lastPitchRef.current === null ||
      Math.abs(pitch - lastPitchRef.current) > 0.5
    ) {
      lastPitchRef.current = pitch;

      try {
        const res = await fetch(`${API_BASE_URL}/api/analyze_pitch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frequency: pitch }),
        });
        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error('🚨 서버 호출 실패:', err);
        setMessage('API 호출 실패');
      }
    }
  };

  const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    for (let offset = 10; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }

      correlation = 1 - correlation / MAX_SAMPLES;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    }

    return bestCorrelation > 0.7 && bestOffset > 10
      ? sampleRate / bestOffset
      : -1;
  };

  const getNote = (frequency) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteNumber = 12 * (Math.log(frequency / 440) / Math.log(2));
    const index = Math.round(noteNumber) + 69;
    return noteNames[index % 12];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">🎸 튜너</h2>
      <p className="text-sm text-gray-600">현재 음: <strong>{note}</strong></p>
      <p className="text-sm text-gray-600">주파수: <strong>{frequency} Hz</strong></p>
      <p className="text-sm text-blue-600 whitespace-pre-wrap mt-2">{message}</p>
      <button
        onClick={() => {
          if (isListening) stopTuning();
          else startTuning();
        }}
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
