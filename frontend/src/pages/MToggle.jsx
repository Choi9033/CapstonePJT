// src/pages/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 햄버거 버튼 (모바일 전용) */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-yellow-400 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* 사이드바 */}
      <div
        className={`fixed sm:static z-40 top-0 left-0 h-full w-60 bg-[#1f1f2e] text-white p-6 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}
      >
        <h1 className="text-xl font-bold mb-6">🎸 Guitara</h1>
        <nav className="flex flex-col gap-4 text-sm">
          <NavLink to="/home" className={({ isActive }) => isActive ? 'text-yellow-300 font-bold' : ''}>🏠 Home</NavLink>
          <NavLink to="/metronome">🎵 Metronome</NavLink>
          <NavLink to="/tuner">🎸 Tuner</NavLink>
          <NavLink to="/rhythm-trainer">🥁 Rhythm Trainer</NavLink>
          <NavLink to="/mypage">👤 My Page</NavLink>
        </nav>
      </div>

      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
