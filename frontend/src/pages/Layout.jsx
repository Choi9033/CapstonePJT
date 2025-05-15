// src/pages/Layout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; // 아이콘 라이브러리 (lucide-react 설치 필요)

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 모바일용 햄버거 메뉴 버튼 */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-md shadow"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* 사이드바 (화면 크기/토글에 따라 표시) */}
      <div
        className={`fixed lg:static z-40 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/*  콘텐츠 영역 */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
