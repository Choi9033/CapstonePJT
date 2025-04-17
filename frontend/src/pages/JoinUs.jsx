import React from 'react';
import { Link } from 'react-router-dom';

function JoinUs() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/guitar.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">회원가입</h1>
        <form className="flex flex-col space-y-4">
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="text"
            placeholder="이름"
            required
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="email"
            placeholder="이메일"
            required
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="password"
            placeholder="비밀번호"
            required
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="password"
            placeholder="비밀번호 확인"
            required
          />
          <button
            className="bg-yellow-400 text-white font-semibold py-2 rounded-md hover:bg-yellow-500 transition"
            type="submit"
          >
            회원가입
          </button>
          <p className="text-sm text-center text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default JoinUs;
