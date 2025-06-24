import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import styles from './AuthForm.module.css';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoggedIn } = useAuth();
  const [loginId, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestData = { loginId, password };

    try {
        const response = await api.post('/api/v1/auth/login', requestData);
        const { accessToken, refreshToken } = response.data.data;
        login(accessToken, refreshToken);
    } catch (error) {
      if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
              const errorMessage = error.response.data.data?.message || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
              alert(errorMessage);
          } else {
              alert('서버와 통신할 수 없습니다.');
          }
      } else {
          alert('알 수 없는 오류가 발생했습니다.');
          console.error("An unexpected error occurred:", error);
      }
    }
   };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>당신의 우주가 기다리고 있었습니다.</h1>
      <p className={styles.subtitle}>어제의 감정은 오늘의 당신에게 어떤 별빛으로 빛나고 있을까요?</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={loginId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginId(e.target.value)}
          placeholder="아이디"
          required
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>로그인</button>
      </form>
      <div className={styles.linkContainer}>
        <span>아직 회원이 아니신가요?</span>
        <Link to="/signup" className={styles.link}>회원가입</Link>
      </div>

      {/* ✨ '메인으로 돌아가기'를 버튼 형태로 변경 */}
      <Link to="/" className={styles.homeLinkButton}>
        메인화면으로 돌아가기
      </Link>
    </div>
  );
}

export default LoginPage;
