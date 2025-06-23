import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance';
import styles from './AuthForm.module.css';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // e.preventDefault();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestData = { email, password }

    try {
        const response = await api.post('/api/v1/auth/login', requestData);
        const { accessToken, refreshToken } = response.data.data;
        login(accessToken, refreshToken); // Context의 login 함수 호출
    } catch (error) { // ✅ error: any를 지웁니다.
      // Axios 에러인지 확인합니다.
      if (axios.isAxiosError(error)) {
          // 서버로부터 응답이 있고, 응답 데이터가 있는 경우
          if (error.response && error.response.data) {
              const errorMessage = error.response.data.data?.message || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
              alert(errorMessage);
          } else {
              // 서버 응답이 없는 네트워크 오류 등
              alert('서버와 통신할 수 없습니다.');
          }
      } else {
          // Axios 에러가 아닌 다른 종류의 에러 (예: 코드 실행 오류)
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
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="이메일"
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
    </div>
  );
}

export default LoginPage;