import React from 'react';

const Login = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/guitar.jpg')` }} // public 폴더 이미지
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Hello.
        </h1>
        <p className="mb-6 text-gray-500 text-center">Welcome back!</p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="ID 입력"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 text-white font-semibold rounded-md hover:bg-yellow-500 transition"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          계정을 찾을 수 없나요?{' '}
          <a href="/join" className="text-red-500 hover:underline font-medium">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
