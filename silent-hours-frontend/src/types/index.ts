export interface PostData {
  postId: number;
  content: string;
  authorNickname: string;
  authorProfileImageUrl: string;
  echoCount: number;
  createdAt: string;
  isEchoed: boolean;
}

// 회원가입 요청 타입
export interface SignUpRequest {
  loginId: string; // ✨ 아이디 필드 추가
  email: string;
  password:string;
  nickname: string; // '별명'에 해당합니다.
}