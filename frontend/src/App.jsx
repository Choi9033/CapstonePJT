import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import JoinUs from './pages/JoinUs';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home 연결 */}
        <Route path="/" element={<Home />} />

        {/* 로그인, 회원가입 테스트용 */}
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<JoinUs />} />
      </Routes>
    </Router>
  );
}

export default App;
