import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';

function App() {
 return (
  <div className='flex max-w-6xl mx-auto'>
    <Sidebar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    <RightPanel />
  </div>
 );
}

export default App
