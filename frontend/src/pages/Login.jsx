import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, provider, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✨ Google 로그인
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestore에 사용자 정보 저장 (없으면 생성)
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: user.displayName || '이름없음',
          email: user.email,
          provider: 'google',
          lastLogin: new Date(),
        },
        { merge: true }
      );

      navigate('/home'); // ✅ 수정됨
    } catch (error) {
      alert('Google 로그인 실패: ' + error.message);
    }
  };

  // ✉️ 이메일 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // ✅ 수정됨
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/guitar.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Hello.
        </h1>
        <p className="mb-6 text-gray-500 text-center">Welcome back!</p>

        {/* ✅ Google 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md font-semibold mb-6 hover:bg-gray-800 w-full"
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
          Google 계정으로 로그인
        </button>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 text-white font-semibold rounded-md hover:bg-yellow-500 transition"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          계정이 없으신가요?{' '}
          <Link to="/join" className="text-red-500 hover:underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
