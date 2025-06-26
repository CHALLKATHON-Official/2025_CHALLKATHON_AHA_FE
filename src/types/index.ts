export interface PostData {
  postId: number;
  content: string;
  authorNickname: string;
  authorProfileImageUrl: string | null; // URL이 없을 수 있으므로 null 허용
  echoCount: number;
  createdAt: string;
  isEchoed: boolean;
  tags: string[];
  isAnonymous: boolean;
  consentToArchive: boolean; // ✨ isAnonymous 필드 추가
}

// ... (이하 다른 타입 정의는 그대로 유지)
export interface SignUpRequest {
  loginId: string;
  email: string;
  password: string;
  nickname: string;
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
