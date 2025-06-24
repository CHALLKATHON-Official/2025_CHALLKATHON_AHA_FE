import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import type { SignUpRequest } from '../types';
import styles from './AuthForm.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUpPage: React.FC = () => {
  const [loginId, setLoginId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    const requestData: SignUpRequest = { loginId, email, password, nickname };

    try {
        await api.post('/api/v1/auth/signup', requestData);
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
    } catch (error) {
        // ✨ 서버에서 오는 다양한 에러 응답을 처리하도록 로직을 개선합니다.
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const errorBody = error.response.data;
                let errorMessage = '회원가입 중 오류가 발생했습니다.';

                // 시나리오 1: 백엔드가 { "message": "에러 내용" } 형태의 응답을 보내는 경우
                if (typeof errorBody.message === 'string') {
                    errorMessage = errorBody.message;
                } 
                // 시나리오 2: 백엔드가 유효성 검사 오류 객체를 보내는 경우 (예: { "email": "이메일 형식이..." })
                else {
                    const validationErrors = errorBody.data || errorBody;
                    if (typeof validationErrors === 'object' && validationErrors !== null) {
                        // 객체의 값들(에러 메시지)을 추출하여 합칩니다.
                        const messages = Object.values(validationErrors).filter(msg => typeof msg === 'string');
                        if (messages.length > 0) {
                            errorMessage = messages.join('\n');
                        }
                    }
                }
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
        
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디"
            required
            className={styles.input}
          />
        </div>

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

        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="별명"
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
