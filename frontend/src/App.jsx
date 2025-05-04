import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import JoinUs from './pages/JoinUs';
import Home from './pages/Home';
import Metronome from './pages/Metronome';
import Tuner from './pages/Tuner';
import RhythmTrainer from './pages/RhythmTrainer';
import MyPage from './pages/MyPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Login />} />

        {/* 로그인 & 회원가입 */}
	<Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<JoinUs />} />

        {/* 기능별 페이지 */}
        <Route path="/metronome" element={<Metronome />} />
        <Route path="/tuner" element={<Tuner />} />
        <Route path="/rhythm-trainer" element={<RhythmTrainer />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
