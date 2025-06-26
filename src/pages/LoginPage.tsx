import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import styles from "./AuthForm.module.css";
import { useAuth } from "../context/AuthContext";
import ErrorModal from "../components/ErrorModal";

const LoginPage: React.FC = () => {
  const { login, isLoggedIn } = useAuth();
  const [loginId, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestData = { loginId, password };

    try {
      const response = await api.post("/api/v1/auth/login", requestData);
      const { accessToken, refreshToken } = response.data.data;
      login(accessToken, refreshToken);
      navigate("/");
    } catch (error) {
      let messageToShow = "알 수 없는 오류가 발생했습니다.";
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.data?.message
        ) {
          messageToShow = error.response.data.data.message;
        } else {
          messageToShow =
            "서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.";
        }
      }
      setErrorMessage(messageToShow);
      setIsErrorModalOpen(true);
    }
  };

  // ✨ 모달을 닫을 때 입력 값도 함께 초기화하는 함수
  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
    setLoginId("");
    setPassword("");
  };

  return (
    <>
      <div className={styles.authContainer}>
        <h1 className={styles.title}>당신의 우주가 기다리고 있었습니다.</h1>
        <p className={styles.subtitle}>
          어제의 감정은 오늘의 당신에게 어떤 별빛으로 빛나고 있을까요?
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={loginId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLoginId(e.target.value)
            }
            placeholder="아이디"
            required
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="비밀번호"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            로그인
          </button>
        </form>
        <div className={styles.linkContainer}>
          <span>아직 회원이 아니신가요?</span>
          <Link to="/signup" className={styles.link}>
            회원가입
          </Link>
        </div>

        <Link to="/" className={styles.homeLinkButton}>
          메인화면으로 돌아가기
        </Link>
      </div>

      {/* ✨ onClose에 새로 만든 함수를 연결 */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorModalClose}
        title="로그인 실패"
        message={errorMessage}
      />
    </>
  );
};

export default LoginPage;
