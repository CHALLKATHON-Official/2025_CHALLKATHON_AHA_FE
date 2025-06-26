// src/types/index.ts
// 게시물 데이터 구조 정의
export interface PostData {
  postId: number;
  content: string;
  authorNickname: string;
  authorProfileImageUrl: string;
  echoCount: number;
  createdAt: string;
  isEchoed: boolean;
  isAnonymous: boolean; // 게시물의 익명 여부
  tags: string[]; // 게시물에 연결된 감정 태그 목록 (문자열 배열)
}

// 회원가입 요청 데이터 구조 정의
export interface SignUpRequest {
  loginId: string;
  email: string;
  password:string;
  nickname: string;
}

// 게시물 생성 요청 데이터 구조 정의
export interface SilentPostCreateRequest {
  content: string;
  emotionTagIds: number[]; // 감정 태그 ID 목록 (숫자 배열)
  isAnonymous: boolean; // 익명 여부
}

// 감정 태그 데이터 구조 정의
export interface EmotionTag {
  id: number;
  tagName: string;
}
