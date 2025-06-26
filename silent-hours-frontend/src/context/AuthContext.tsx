// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axiosInstance';
import type { LoginRequest, SignUpRequest, TokenResponse } from '../types/auth'; // auth.ts에서 타입 임포트
import { jwtDecode } from 'jwt-decode'; // jwt-decode 라이브러리 임포트

// AuthContext에 필요한 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 로컬 스토리지에서 토큰 확인 및 로그인 상태 초기화
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      try {
        // Access Token 유효성 간단히 검사 (만료 시간 확인)
        const decodedToken: { exp: number, sub: string, auth: string } = jwtDecode(accessToken);
        if (decodedToken.exp * 1000 > Date.now()) { // 만료 시간(초)을 밀리초로 변환
          setIsLoggedIn(true);
          // 토큰에서 사용자 정보(예: 이메일)를 추출하여 userEmail 상태 업데이트
          setUserEmail(decodedToken.sub); // 'sub' 클레임에 이메일 또는 loginId가 저장되어 있다고 가정
        } else {
          // Access Token 만료 시, Refresh Token으로 갱신 시도
          handleTokenRefresh(refreshToken);
        }
      } catch (error) {
        console.error('Invalid Access Token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail(null);
    }
  }, []);

  // 토큰 갱신 로직 (재사용을 위해 useCallback 사용)
  const handleTokenRefresh = useCallback(async (refreshToken: string) => {
    try {
      const response = await api.post<TokenResponse>('/api/v1/auth/refresh', { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setIsLoggedIn(true);
      const decodedToken: { exp: number, sub: string, auth: string } = jwtDecode(newAccessToken);
      setUserEmail(decodedToken.sub);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUserEmail(null);
      // alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      return false;
    }
  }, []);


  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post<TokenResponse>('/api/v1/auth/login', credentials);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setIsLoggedIn(true);
      const decodedToken: { exp: number, sub: string, auth: string } = jwtDecode(accessToken);
      setUserEmail(decodedToken.sub);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoggedIn(false);
      setUserEmail(null);
      throw error; // 로그인 실패 시 에러를 던져 상위 컴포넌트에서 처리
    }
  };

  const signup = async (userData: SignUpRequest) => {
    try {
      await api.post('/api/v1/auth/signup', userData);
      // 회원가입 성공 후 로그인 처리 (선택 사항)
      // await login({ loginId: userData.loginId, password: userData.password });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.post('/api/v1/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Logout failed on server:', error);
        // 서버에서 로그아웃 실패해도 클라이언트 토큰은 제거
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  const authContextValue = {
    isLoggedIn,
    login,
    signup,
    logout,
    userEmail,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
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
