import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Header />
      {/* ✅ main 태그의 style 속성에 display:flex 와 정렬 관련 속성들을 추가합니다. */}
      <main style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '70px', 
        minHeight: 'calc(100vh - 70px)',
        boxSizing: 'border-box'
      }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* 일치하는 경로가 없을 때 기본 경로로 이동 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;