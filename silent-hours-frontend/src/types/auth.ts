// src/types/auth.ts

// 로그인 요청 시 사용될 데이터 구조 정의
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 회원가입 요청 시 사용될 데이터 구조 정의
export interface SignUpRequest {
  email: string;
  loginId: string;
  password: string;
  nickname: string;
}

// 토큰 응답 시 사용될 데이터 구조 정의 (액세스 토큰 및 리프레시 토큰 포함)
export interface TokenResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
}
