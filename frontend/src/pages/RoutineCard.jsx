import React from 'react';

const RoutineCard = ({ onComplete }) => {
  const weeklyRoutine = [
    {
      요일: '일요일',
      코드: 'A – E – F#m – D',
      스트로크: 'Downup–Down–Up–Up',
      템포: 87,
    },
    {
      요일: '월요일',
      코드: 'G – D – Em – C',
      스트로크: 'Down–Downup–Up–Up–Down',
      템포: 90,
    },
    {
      요일: '화요일',
      코드: 'Am – C – Dm – G',
      스트로크: 'Down–Down–Up–Up–Down',
      템포: 80,
    },
    {
      요일: '수요일',
      코드: 'E – A – B7',
      스트로크: 'Down–Up–Down–Up',
      템포: 85,
    },
    {
      요일: '목요일',
      코드: 'C – G – Am – F',
      스트로크: 'Down–Down–Downup–Up',
      템포: 88,
    },
    {
      요일: '금요일',
      코드: 'D – Bm – G – A',
      스트로크: 'Down–Up–Up–Down–Down',
      템포: 92,
    },
    {
      요일: '토요일',
      코드: 'Em – C – G – D',
      스트로크: 'Down–Down–Down–Up',
      템포: 86,
    },
  ];

  const todayIndex = new Date().getDay();
  const routine = weeklyRoutine[todayIndex];

  return (
    <div>
      <h2 className="text-lg font-bold text-yellow-600 mb-2">
        🎵 오늘의 연습 루틴
      </h2>
      <ul className="text-sm text-gray-800 space-y-1">
        <li>
          <strong>요일:</strong> {routine.요일}
        </li>
        <li>
          <strong>코드 진행:</strong> {routine.코드}
        </li>
        <li>
          <strong>스트로크 패턴:</strong> {routine.스트로크}
        </li>
        <li>
          <strong>목표 템포:</strong> {routine.템포} BPM
        </li>
      </ul>
      <button
        onClick={onComplete}
        className="mt-4 bg-yellow-400 text-white py-1 px-4 rounded hover:bg-yellow-500 transition"
      >
        연습 완료
      </button>
    </div>
  );
};

export default RoutineCard;
