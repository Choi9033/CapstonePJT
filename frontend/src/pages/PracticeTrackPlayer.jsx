// components/PracticeTrackPlayer.jsx
import React, { useState, useRef } from 'react';

const tracks = [
  { id: 'mr1', name: '🎵 MR - 첫사랑', file: '/first_love.wav' },
  { id: 'mr2', name: '🎵 MR - 청춘', file: '/youth.wav' },
  { id: 'mr3', name: '🎵 MR - 너에게 난', file: 'you_and_i.wav' },
];

const PracticeTrackPlayer = () => {
  const [selectedTrack, setSelectedTrack] = useState(tracks[0].file);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(selectedTrack));

  const handleTrackChange = (file) => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current = new Audio(file);
    setSelectedTrack(file);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">🎧 연습용 MR 선택</h2>
      <div className="flex flex-col gap-2 mb-4">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => handleTrackChange(track.file)}
            className={`text-left px-4 py-2 rounded-lg border ${
              selectedTrack === track.file ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-gray-300'
            } hover:bg-yellow-50 transition`}
          >
            {track.name}
          </button>
        ))}
      </div>
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {isPlaying ? '⏸️ 정지' : '▶️ 재생'}
      </button>
    </div>
  );
};

export default PracticeTrackPlayer;
