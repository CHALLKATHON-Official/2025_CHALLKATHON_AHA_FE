// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types/auth'; // 로그인 요청 타입 임포트

const LoginPage: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // AuthContext에서 login 함수 가져오기
  const navigate = useNavigate(); // 라우팅을 위한 navigate 훅

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // 오류 메시지 초기화

    if (!loginId || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const credentials: LoginRequest = { loginId, password };
      await login(credentials); // 로그인 함수 호출
      navigate('/main'); // 로그인 성공 시 메인 페이지로 이동
    } catch (err: any) {
      // 서버에서 반환된 에러 메시지를 사용자에게 표시
      const errorMessage = err.response?.data?.data?.message || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
      setError(errorMessage);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>로그인</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="loginId">아이디</label>
          <input
            type="text"
            id="loginId"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>로그인</button>
        <button type="button" onClick={handleSignUpClick} className={styles.linkButton}>
          계정이 없으신가요? 회원가입
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
