export interface PostData {
  postId: number;
  content: string;
  authorNickname: string;
  authorProfileImageUrl: string;
  echoCount: number;
  createdAt: string;
  isEchoed: boolean;
  tags: string[]
}

// 회원가입 요청 타입
export interface SignUpRequest {
  loginId: string; // ✨ 아이디 필드 추가
  email: string;
  password: string;
  nickname: string; // '별명'에 해당합니다.
}

export interface TimelineEntry {
  entryId: number;
  content: string;
  eraYear: number;
  eraMonth: number;
  originalCreatedAt: string;
}

export interface UserProfile {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
}
