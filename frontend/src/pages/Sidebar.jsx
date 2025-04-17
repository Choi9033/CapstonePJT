import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">🎸 Guitara</h2>
      <nav>
        <ul className="space-y-4 text-lg">
          <li className="hover:text-yellow-400 cursor-pointer">🏠 Home</li>
          <li className="hover:text-yellow-400 cursor-pointer">🎵 Metronome</li>
          <li className="hover:text-yellow-400 cursor-pointer">🎸 Tuner</li>
          <li className="hover:text-yellow-400 cursor-pointer">
            🥁 Rhythm Trainer
          </li>
          <li className="hover:text-yellow-400 cursor-pointer">👤 My Page</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
