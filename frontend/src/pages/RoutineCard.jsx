import React from 'react';

const RoutineCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-2 text-yellow-600">
        🎵 Today’s Routine
      </h2>
      <ul className="text-gray-700 text-sm list-disc list-inside space-y-1">
        <li>Chords: G – D – Em – C</li>
        <li>Strumming Pattern: Down–Downup–Up–Up–Down</li>
        <li>Target Tempo: 90 BPM</li>
      </ul>
      <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded text-sm">
        Start Practice
      </button>
    </div>
  );
};

export default RoutineCard;
