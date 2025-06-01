import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import JoinUs from './pages/JoinUs';
import Layout from './pages/Layout'; // 사이드바 포함된 레이아웃
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="metronome" element={<Metronome />} />
          <Route path="tuner" element={<Tuner />} />
          <Route path="rhythm-trainer" element={<RhythmTrainer />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>

        {/* 로그인 & 회원가입 */}
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<JoinUs />} />
      </Routes>
    </Router>
  );
}

export default App;

