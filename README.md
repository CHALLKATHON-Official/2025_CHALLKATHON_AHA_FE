# 2025_CHALLKATHON_AHA_BE

## Silent Hours
조용한 공간에서 나만의 감정을 글로 마주하고, 같은 시간대에 기록된 피드들과 공감으로 연결되는 감정 아카이빙 서비스

## 기능별 소개
📝 <b>1. 감정 기록 (SilentPost)</b>

사용자가 자유롭게 감정을 작성하면서 2초간 타이핑이 멈추면 자동으로 감정 분석 요청이 발생한다.
Gemini 1.5 Flash 모델 API를 통해 감정 키워드가 추출되며, 사용자 선택에 따라 게시글과 함께 저장된다.

<pre>
기술 포인트:
	1.POST /api/v1/emotions/analyze
      → 감정 키워드 분석 요청 (content 입력값 전송)
  
	2.감정 키워드 응답 예시:
      [
      { "id": 1, "tagName": "기쁨" },
      { "id": 2, "tagName": "설렘" }
      ]
  
  3.사용자가 원하는 키워드를 선택 후 게시
  
  4.POST /api/v1/posts
      → 게시글 + 선택한 감정 키워드 ID 리스트 + 익명 여부 전송

  - 저장 구조
  	1) SilentPost: 게시글 엔티티<br>
  	2) EmotionTag: 감정 태그 엔티티<br>
  	3) SilentPostEmotionTag: N:M 매핑 테이블로 연결됨

  - 실시간 자동 감정 분석, 키워드 선택, 익명 토글까지 포함된 직관적 UX 구현
</pre>

👥 <b>2. 공감 연대기 (Empathy Timeline)</b>

같은 시간대에 작성된 감정 기록들을 그룹화하여 피드 형식으로 제공한다.
감정 태그 중심의 시각적 구성과 함께, 사용자의 감정을 시간 흐름에 따라 아카이빙을 한다.

<pre>
기술 포인트:
	1.GET /api/v1/posts
      → 전체 피드 조회 (페이지네이션 지원)
  
	2.응답 구조:
        {
          "status": "SUCCESS",
          "data": {
            "totalElements": 125,
            "totalPages": 13,
            "first": true,
            "last": false,
            "size": 10,
            "content": [
              {
                "postId": 12,
                "content": "오늘은 유난히 평화로운 하루였어요.",
                "authorNickname": "별똥별",
                "authorProfileImageUrl": "https://example.com/images/profile1.jpg",
                "echoCount": 3,
                "createdAt": "2025-06-26T09:44:33.398Z",
                "tags": ["안정감", "기쁨"],
                "isAnonymous": false
              },
              {
                "postId": 11,
                "content": "뭔가 잘 될 것 같은 느낌이 들어요.",
                "authorNickname": "익명",
                "authorProfileImageUrl": "",
                "echoCount": 5,
                "createdAt": "2025-06-26T09:42:12.183Z",
                "tags": ["기대감", "설렘", "희망"],
                "isAnonymous": true
              }
            ],
            "number": 0,
            "sort": {
              "empty": false,
              "unsorted": false,
              "sorted": true
            },
            "numberOfElements": 2,
            "pageable": {
              "offset": 0,
              "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
              },
              "unpaged": false,
              "paged": true,
              "pageNumber": 0,
              "pageSize": 10
            },
            "empty": false
          },
          "message": "감정 피드를 성공적으로 조회했습니다."
        }
  
  3.사용자가 원하는 키워드를 선택 후 게시
  
  4.POST /api/v1/posts
      → 게시글 + 선택한 감정 키워드 ID 리스트 + 익명 여부 전송

  1) @Query 기반 JOIN FETCH로 사용자 정보와 게시글을 한번에 로딩
  2) 감정 태그는 DTO에서 별도로 추출 및 매핑
  3) Page_SilentPost → Page_PostResponse 변환
  4) 감정 피드는 해당 시간대 기준으로 그룹화되어 반환  
</pre>

📢 <b>3. 메아리 토글 (공감 버튼)</b>

게시글에 대해 ‘공감’을 누를 수 있는 기능.
동일 사용자는 게시글당 1회만 메아리를 보낼 수 있으며 다시 누르면 취소된다.

<pre>
기술 포인트:
	1.POST /api/v1/posts/{postId}/echo
      → 메아리 추가 (공감 누르기/ 취소)
  
	2.프론트에서 상태 관리:
    	•	게시글별 isEchoed, echoCount 상태 유지
    	•	메아리 수 실시간 반영

  - 보안 처리
	  1) Spring Security로 인증된 사용자만 메아리 전송 가능
	  2) DB에는 Echo 테이블로 userId, postId 조합으로 저장
</pre>

## 개발자 소개
| 이름 | 역할 | GitHub |
|------|------|--------|
| 김태우 | 백엔드 & 기획 | [@TAEW00KIM](https://github.com/TAEW00KIM) |
| 배강민 | 프론트엔드 & 기획 | [@gminggggg](https://github.com/gminnggggg) |
| 이정민 | 백엔드 & 기획 | [@i2mmi](https://github.com/i2mmi) |
| 박찬미 | 백엔드 & 기획 | [@chanmi05](https://github.com/chanmi05) |

## 사용 기술 스택
- <b>Backend</b><br>
  [![Spring](https://img.shields.io/badge/Spring-6DB33F?style=flat-square&logo=spring&logoColor=white)](https://spring.io/)
  [![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=spring&logoColor=white)](https://spring.io/projects/spring-security)
  [![JPA](https://img.shields.io/badge/JPA-3498DB?style=flat-square&logo=jpa&logoColor=white)](https://docs.oracle.com/javaee/6/tutorial/doc/bnbpz.html)
  [![Lombok](https://img.shields.io/badge/Lombok-BC2E86?style=flat-square&logo=lombok&logoColor=white)](https://projectlombok.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

  에디터 : IntelliJ</br>
  프레임워크 : SpringBoot 3.5.3</br>
  언어 : JAVA 17</br>
  빌드 : Gradle </br>
  서버 : localhost</br>
  데이터베이스 : MySql</br>
  라이브러리 : SpringBoot Web, MySQL, Spring Data JPA, Lombok, Spring Security(JWT 인증), Spring Boot DevTools, Validation

- <b>Frontend</b><br>
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS Modules](https://img.shields.io/badge/CSS%20Modules-000000?style=flat&logo=css3&logoColor=white)]()
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)](https://axios-http.com/)
[![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=Zustand&logoColor=white)](https://github.com/pmndrs/zustand)

  에디터 : VScode</br>
  프레임워크 : React (Vite 기반)</br>
  언어 : TypeScript</br>
  스타일링 : CSS Modules</br>
  상태 관리 : Zustand</br>
  API 통신 : Axios</br>
  패키지 매니저 : npm or yarn

## 파일 구조
  - <b>Backend</b></br>
    <pre>
    2025_CHALLKATHON_AHA_BE/
    ├── build/                   # 빌드 파일
    ├── gradle/                 # Gradle 관련 설정
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com.taewoo.silenth/
    │       │       ├── common/           # 공통 상수 및 Enum
    │       │       │   ├── ErrorCode
    │       │       │   ├── Role
    │       │       │   └── TimeSlot
    │       │       ├── config/           # Spring 설정
    │       │       ├── controller/       # REST API 컨트롤러
    │       │       ├── converter/        # DTO ↔ Entity 변환
    │       │       ├── exception/        # 예외 처리
    │       │       ├── external.gemini/  # Gemini API 연동 모듈
    │       │       ├── handler/          # 예외 핸들러
    │       │       ├── repository/       # JPA 리포지토리
    │       │       ├── scheduler/        # 스케줄링 작업
    │       │       ├── service/          # 비즈니스 로직
    │       │       ├── util/             # 유틸리티 함수
    │       │       └── web/
    │       │           ├── dto/          # 요청/응답 DTO
    │       │           └── entity/       # JPA 엔티티
    │       └── resources/
    │           └── application.yml       # 환경 설정 파일
    ├── test/                  # 테스트 코드
    ├── build.gradle           # Gradle 빌드 설정
    ├── settings.gradle        # 프로젝트 설정
    └── README.md              # 프로젝트 소개 문서
    </pre>
  - <b>Frontend</b></br>  
    <pre>
    2025_CHALLKATHON_AHA_FE/
    ├── public/                      # 정적 파일 (이미지, SVG 등)
    │   ├── background.png
    │   ├── default-profile.png
    │   └── vite.svg
    
    ├── src/                         # 소스코드 폴더
    │   ├── api/                     # Axios 인스턴스 설정
    │   │   └── axiosInstance.ts
    │
    │   ├── assets/                  # 이미지 및 기타 정적 자산
    │   │   └── react.svg
    │
    │   ├── components/              # 재사용 가능한 UI 컴포넌트
    │   │   ├── CreatePostModal.tsx
    │   │   ├── ErrorModal.tsx
    │   │   ├── Header.tsx
    │   │   ├── LoginConfirmModal.tsx
    │   │   ├── MyPage.tsx
    │   │   ├── PostCard.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── SuccessModal.tsx
    │   │   ├── TimelineCard.tsx
    │   │   └── *.module.css         # 각 컴포넌트에 대응되는 CSS 모듈
    │
    │   ├── context/                 # 전역 상태 관리 (ex. 로그인 정보)
    │   │   └── AuthContext.tsx
    │
    │   ├── layouts/                 # 공통 레이아웃
    │   │   ├── MainLayout.tsx
    │   │   └── MainLayout.module.css
    │
    │   ├── pages/                   # 주요 페이지 컴포넌트
    │   │   ├── LoginPage.tsx
    │   │   ├── MainPage.tsx
    │   │   ├── MyChroniclePage.tsx
    │   │   ├── SignUpPage.tsx
    │   │   ├── TimelinePage.tsx
    │   │   └── *.module.css         # 페이지별 스타일
    │
    │   ├── types/                   # TypeScript 타입 정의
    │   ├── App.tsx                  # 루트 컴포넌트
    │   ├── main.tsx                 # 엔트리 포인트
    │   ├── index.css                # 전역 스타일
    │   └── App.module.css
    │
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── README.md
    </pre>












<<<<<<< HEAD
<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
=======
# 2025_CHALLKATHON_AHA_BE
>>>>>>> d2a09e39bc53ef6546cb2b2b2d624acb99a4baaf
=======
# 2025_CHALLKATHON_AHA_FE
>>>>>>> cdcda82e5b2d8f6a1a6dca9d5852aa02ec81b134
