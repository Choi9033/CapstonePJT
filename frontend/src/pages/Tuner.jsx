import React from 'react';

const Tuner = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <h2 className="font-semibold text-lg mb-2 text-blue-600">🎸 Tuner</h2>
      <p className="text-gray-700 text-sm mb-4">Current Note: A</p>
      <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-blue-400 transition-all duration-300"></div>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Adjust your string until the note is centered
      </p>
    </div>
  );
};

export default Tuner;
