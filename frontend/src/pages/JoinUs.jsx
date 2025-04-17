import React from 'react';
import { Link } from 'react-router-dom';

function JoinUs() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/guitar.jpg')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-yellow-500 mb-2 text-center">
          Guitar with us <span className="inline-block animate-pulse">🎸</span>
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          지금 가입하고 당신만의 연주를 시작해보세요.
          <br />
          오늘의 연주가 내일의 기적이 됩니다.
        </p>

        <button className="flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md font-semibold mb-6 hover:bg-gray-800 w-full">
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          Google 계정으로 가입
        </button>

        <form className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            type="text"
            placeholder="이름 입력"
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            type="email"
            placeholder="이메일 주소"
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            type="password"
            placeholder="비밀번호"
            required
          />

          <div className="flex items-center gap-2">
            <input type="checkbox" className="accent-yellow-400" required />
            <label className="text-sm text-gray-600">
              이용약관에 동의합니다
            </label>
          </div>

          <button
            className="w-full bg-yellow-400 text-white py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
            type="submit"
          >
            확인하기
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          이미 계정이 있으신가요?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

export default JoinUs;
