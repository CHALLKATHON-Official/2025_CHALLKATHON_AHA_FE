export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// 백엔드에서 올 수 있는 에러 응답 타입
export interface ErrorResponse {
  message: string;
}