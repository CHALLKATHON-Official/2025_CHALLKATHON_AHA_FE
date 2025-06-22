import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance';
import styles from './AuthForm.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const requestData = { email, password };

  try {
    // api 인스턴스를 사용해 로그인 요청
    const response = await api.post('/api/v1/auth/login', requestData);

    // 응답 데이터 구조에 맞춰 accessToken과 refreshToken을 추출
    const { accessToken, refreshToken } = response.data.data;

    // 토큰들을 localStorage에 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    alert('로그인 성공!');
    navigate('/main');

  } catch (error: any) {
    // Axios 에러인 경우, 서버가 보낸 에러 메시지를 표시
    if (error.response && error.response.data) {
        alert(error.response.data.data.message || '로그인에 실패했습니다.');
    } else {
        alert('로그인 중 알 수 없는 오류가 발생했습니다.');
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