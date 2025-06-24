import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import Header from './components/Header';
import CreatePostModal from './components/CreatePostModal';
import LoginConfirmModal from './components/LoginConfirmModal';

// 로그인/회원가입 페이지 레이아웃
const AuthLayout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    {children}
  </div>
);

const AppContent: React.FC = () => {
  const { isLoading, isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // 앱 전체 컨테이너 스타일
  const appContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: `url('/background.jpg') center/cover no-repeat fixed`,
  };

  // 메인 컨텐츠 영역 스타일
  const mainStyle: React.CSSProperties = {
    paddingTop: isAuthPage ? '0' : '60px',
    height: isAuthPage ? '100vh' : 'calc(100vh - 60px)',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    paddingLeft: isAuthPage ? '0' : '20px', // 레이아웃과 컨텐츠간 여백
    paddingRight: isAuthPage ? '0' : '20px',
    display: 'flex',          // ✨ 이 줄을 추가해 주세요.
    justifyContent: 'center',
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f172a' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={appContainerStyle}>
      {!isAuthPage && <Header />}
      
      <main style={mainStyle}>
        <Routes>
            <Route
                path="/*"
                element={
                    <MainLayout
                        openCreateModal={() => setIsModalOpen(true)}
                        openLoginModal={() => setIsLoginModalOpen(true)}
                    >
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            {/* 여기에 /timeline 등 다른 페이지 라우트를 추가할 수 있습니다. */}
                        </Routes>
                    </MainLayout>
                }
            />
            <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" /> : <AuthLayout><LoginPage /></AuthLayout>}
            />
            <Route
                path="/signup"
                element={isLoggedIn ? <Navigate to="/" /> : <AuthLayout><SignUpPage /></AuthLayout>}
            />
        </Routes>
      </main>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPostCreated={() => { setIsModalOpen(false); window.dispatchEvent(new CustomEvent('post-created')); }} />
      <LoginConfirmModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;