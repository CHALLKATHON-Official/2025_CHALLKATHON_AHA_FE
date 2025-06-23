import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import type { SignUpRequest } from '../types/auth';
import styles from './AuthForm.module.css';
// 1. 아이콘을 사용하기 위해 import 합니다.
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // 2. 비밀번호 확인을 위한 상태를 추가합니다.
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  // 3. 비밀번호 보이기/숨기기 상태를 추가합니다.
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 4. 비밀번호 일치 여부를 먼저 확인합니다.
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return; // 일치하지 않으면 함수를 여기서 종료합니다.
    }
    
    const requestData: SignUpRequest = { email, password, username };

    try {
        const response = await api.post('/api/v1/auth/signup', requestData);
        alert(response.data.message);
        navigate('/login');
    } catch (error) { // ✅ error: any를 지웁니다.
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.data?.message || '회원가입 중 오류가 발생했습니다.';
                alert(errorMessage);
            } else {
                alert('서버와 통신할 수 없습니다.');
            }
        } else {
            alert('알 수 없는 오류가 발생했습니다.');
            console.error("An unexpected signup error occurred:", error);
        }
    }
};
  
  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>세상에 없던, 당신만의 작은 우주</h1>
      <p className={styles.subtitle}>찰나의 생각과 감정들이 모여 당신의 역사가 됩니다.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* 이메일 입력창을 div로 감싸줍니다. */}
        <div className={styles.inputWrapper}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
            className={styles.input}
          />
        </div>

        {/* 비밀번호 입력창 */}
        <div className={styles.inputWrapper}>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            className={styles.input}
          />
          <span 
            className={styles.passwordToggleIcon}
            onMouseDown={() => setIsPasswordVisible(true)}
            onMouseUp={() => setIsPasswordVisible(false)}
            onMouseLeave={() => setIsPasswordVisible(false)}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* 비밀번호 확인 입력창 */}
        <div className={styles.inputWrapper}>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            required
            className={styles.input}
          />
        </div>

        {/* 닉네임 입력창을 div로 감싸줍니다. */}
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="닉네임"
            required
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>우주 만들기</button>
      </form>
      <div className={styles.linkContainer}>
        <span>이미 당신의 우주가 있나요?</span>
        <Link to="/login" className={styles.link}>우주로 입장하기</Link>
      </div>
    </div>
  );
}

export default SignUpPage;