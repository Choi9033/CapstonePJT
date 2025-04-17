import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import JoinUs from './pages/JoinUs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/join" element={<JoinUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
