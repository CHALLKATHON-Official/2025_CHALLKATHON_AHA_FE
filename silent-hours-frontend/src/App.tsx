// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import Header from './components/Header'; // Header 컴포넌트 임포트
import CreatePostModal from './components/CreatePostModal'; // CreatePostModal 컴포넌트 임포트
import LoginConfirmModal from './components/LoginConfirmModal'; // LoginConfirmModal 컴포넌트 임포트

// 인증이 필요한 라우트를 감싸는 컴포넌트
// 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// 로그인/회원가입 페이지 레이아웃
const AuthLayout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    {children}
  </div>
);

// 앱의 주요 콘텐츠를 담는 컴포넌트 (라우팅 로직 포함)
const AppContent: React.FC = () => {
  // AuthContext에서 인증 상태 및 로딩 상태 가져오기
  const { isLoggedIn } = useAuth();
  // 게시물 작성 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 로그인 확인 모달 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // 현재 URL 경로 정보 가져오기
  const location = useLocation();
  // 현재 페이지가 로그인 또는 회원가입 페이지인지 확인
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // 앱 전체 컨테이너 스타일 정의
  const appContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    // 백그라운드 이미지를 가정합니다. 실제 이미지 경로는 프로젝트에 맞게 조정하세요.
    background: `url('/background.jpg') center/cover no-repeat fixed`, 
  };

  // 메인 컨텐츠 영역 스타일 정의 (인증 페이지 여부에 따라 패딩 등 조정)
  const mainStyle: React.CSSProperties = {
    paddingTop: isAuthPage ? '0' : '60px', // 인증 페이지가 아니면 헤더 높이만큼 패딩
    height: isAuthPage ? '100vh' : 'calc(100vh - 60px)', // 인증 페이지는 전체 높이, 아니면 헤더 제외 높이
    boxSizing: 'border-box', // 패딩이 요소 크기에 포함되도록 설정
    backgroundColor: 'transparent', // 배경색 투명
    paddingLeft: isAuthPage ? '0' : '20px',
    paddingRight: isAuthPage ? '0' : '20px',
    display: 'flex',
    justifyContent: 'center', // 컨텐츠를 중앙 정렬
  };

  // AuthContext의 로딩 상태가 true일 경우 로딩 화면 표시
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f172a' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={appContainerStyle}>
      {/* 인증 페이지가 아닐 때만 Header 컴포넌트 렌더링 */}
      {!isAuthPage && <Header />}
      
      <main style={mainStyle}>
        {/* ✨ 단 하나의 <Routes> 컴포넌트만 사용합니다. */}
        <Routes>
          {/* 로그인 페이지 */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <AuthLayout><LoginPage /></AuthLayout>}
          />
          {/* 회원가입 페이지 */}
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <AuthLayout><SignUpPage /></AuthLayout>}
          />

          {/* 메인 애플리케이션 페이지들 (MainLayout과 PrivateRoute 적용) */}
          {/* /main 경로에 대한 라우트 정의 */}
          <Route
            path="/main"
            element={
              <PrivateRoute> {/* 인증이 필요한 페이지이므로 PrivateRoute로 감쌈 */}
                <MainLayout /* 메인 레이아웃 적용 */
                  openCreateModal={() => setIsModalOpen(true)}
                  openLoginModal={() => setIsLoginModalOpen(true)}
                >
                  <MainPage /> {/* MainPage가 이제 MainLayout의 자식입니다. */}
                </MainLayout>
              </PrivateRoute>
            }
          />
          {/* 여기에 /timeline 등 다른 인증 필요한 페이지 라우트를 추가할 수 있습니다. */}
          {/* 예시:
          <Route
            path="/timeline"
            element={
              <PrivateRoute>
                <MainLayout
                  openCreateModal={() => setIsModalOpen(true)}
                  openLoginModal={() => setIsLoginModalOpen(true)}
                >
                  <TimelinePage /> // TimelinePage 컴포넌트 (가정)
                </MainLayout>
              </PrivateRoute>
            }
          />
          */}

          {/* 루트 경로 ('/')에 대한 리다이렉션. /main으로 이동하도록 설정 */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          {/* 정의되지 않은 모든 경로를 /main으로 리다이렉트 (캐치올 라우트) */}
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </main>

      {/* 모달 컴포넌트들은 라우터 외부에 (또는 최상위) 위치하여 어떤 페이지에서도 열릴 수 있도록 합니다. */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={() => { 
          setIsModalOpen(false); 
          // 새 게시물 생성 시 'post-created' 이벤트를 발생시켜 메인 페이지 피드를 새로고침
          window.dispatchEvent(new CustomEvent('post-created')); 
        }} 
      />
      <LoginConfirmModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModal(false)} 
      />
    </div>
  );
}

// 최상위 App 컴포넌트: BrowserRouter와 AuthProvider로 전체 애플리케이션을 감쌈
const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent /> {/* AppContent가 모든 라우팅 및 앱 콘텐츠를 관리합니다. */}
    </AuthProvider>
  </BrowserRouter>
);

export default App;
