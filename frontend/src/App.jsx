import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import JoinUs from './pages/JoinUs';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Metronome from './pages/Metronome';
import Tuner from './pages/Tuner';
import RhythmTrainer from './pages/RhythmTrainer';
import MyPage from './pages/MyPage';
import { MicSensitivityProvider } from './contexts/MicSensitivityContext'; // ✅ 여기 추가

function App() {
  return (
    <MicSensitivityProvider> {/* ✅ 전체 앱을 감쌈 */}
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="metronome" element={<Metronome />} />
            <Route path="tuner" element={<Tuner />} />
            <Route path="rhythm-trainer" element={<RhythmTrainer />} />
            <Route path="mypage" element={<MyPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<JoinUs />} />
        </Routes>
      </Router>
    </MicSensitivityProvider>
  );
}

export default App;
