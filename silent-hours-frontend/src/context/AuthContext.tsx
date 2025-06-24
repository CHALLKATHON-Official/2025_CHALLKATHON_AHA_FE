import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean; // 초기 로딩 상태
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ✨ 앱이 처음 로드될 때 localStorage에서 토큰 존재 여부로 초기 상태를 결정합니다.
  // 이 방식이 상태 동기화에 더 안정적입니다.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // ✨ useCallback을 사용하여 함수가 불필요하게 재생성되는 것을 방지합니다.
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/login');
  }, [navigate]);

  const login = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsLoggedIn(true);
  }, []);

  // 초기 로딩 상태를 처리합니다.
  useEffect(() => {
    // 앱이 로드될 때 잠시 로딩 상태를 보여주어 UI 깜빡임을 방지합니다.
    setIsLoading(false);
  }, []);

  // ✨ axiosInstance에서 보낸 'logout' 이벤트를 감지하는 리스너를 추가합니다.
  useEffect(() => {
    const handleLogout = () => {
      logout();
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    };

    window.addEventListener('logout', handleLogout);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
