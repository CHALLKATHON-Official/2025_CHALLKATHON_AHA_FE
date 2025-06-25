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

// 로그인/회원가입 페이지 레이아웃
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}
  >
    {children}
  </div>
);

const AppContent: React.FC = () => {
  const { isLoading, isLoggedIn } = useAuth();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // ✨ 모바일 사이드바 상태

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const appContainerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: `url('/background.jpg') center/cover no-repeat fixed`,
  };

  const mainStyle: React.CSSProperties = {
    paddingTop: "60px",
    height: "calc(100vh - 60px)",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
  };

  if (isAuthPage) {
    // 인증 페이지는 별도 레이아웃 적용
    return (
      <div style={appContainerStyle}>
        <main
          style={{
            height: "100vh",
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

  return (
    <div style={appContainerStyle}>
      {/* ✨ Header에 사이드바 토글 함수 전달 */}
      <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

      <main style={mainStyle}>
        <Routes>
          <Route
            path="/*"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen} // ✨ 사이드바 상태 전달
                onSidebarClose={() => setSidebarOpen(false)} // ✨ 사이드바 닫기 함수 전달
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
