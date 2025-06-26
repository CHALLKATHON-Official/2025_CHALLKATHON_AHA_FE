import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import Header from "./components/Header";
import CreatePostModal from "./components/CreatePostModal";
import LoginConfirmModal from "./components/LoginConfirmModal";
import TimelinePage from "./pages/TimelinePage";
import MyChroniclePage from "./pages/MyChroniclePage";
import MyPage from "./components/MyPage";

const AppContent: React.FC = () => {
  const { isLoading, isLoggedIn } = useAuth();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const appContainerStyle: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: `url('/background.jpg') center/cover no-repeat fixed`,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: '42px',
    boxSizing: 'border-box'
  };
  
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#0f172a",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // 👇 로그인/회원가입 페이지일 경우, 헤더 없이 별도의 레이아웃을 적용합니다.
  if (isAuthPage) {
    return (
      <div style={{...appContainerStyle, paddingTop: 0}}>
        <main
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
              path="/signup"
              element={isLoggedIn ? <Navigate to="/" /> : <SignUpPage />}
            />
          </Routes>
        </main>
      </div>
    );
  }

  // 그 외 모든 페이지는 기존 레이아웃을 사용합니다.
  return (
    <div style={appContainerStyle}>
      <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

      <main style={mainStyle}>
        <Routes>
          <Route
            path="/*"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                onSidebarClose={() => setSidebarOpen(false)}
                openCreateModal={() => setCreateModalOpen(true)}
                openLoginModal={() => setLoginModalOpen(true)}
              >
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/timeline" element={<TimelinePage />} />
                  <Route path="/my-chronicle" element={<MyChroniclePage />} />
                  <Route path="/mypage" element={<MyPage />} />
                  {/* 여기에 /timeline 등 다른 페이지 라우트를 추가할 수 있습니다. */}
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </main>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPostCreated={() => {
          setCreateModalOpen(false);
          window.dispatchEvent(new CustomEvent("post-created"));
        }}
      />
      <LoginConfirmModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
