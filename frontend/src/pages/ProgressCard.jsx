import React from 'react';

const ProgressCard = ({ completedDays }) => {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date().getDay();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-3">📝 연습 진행률</h2>
      <div className="flex gap-2 mb-3">
        {dayNames.map((day, index) => {
          const done =
            Array.isArray(completedDays) && completedDays.includes(index);
          return (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
                ${
                  done
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 text-gray-400 border border-gray-300'
                }
                ${index === today ? 'ring-2 ring-yellow-500' : ''}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
      <p className="text-sm text-gray-700">
        이번 주 7일 중 {Array.isArray(completedDays) ? completedDays.length : 0}
        일 완료
      </p>
    </div>
  );
};

export default ProgressCard;
