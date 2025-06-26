import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import type { SignUpRequest } from "../types";
import styles from "./AuthForm.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SuccessModal from "../components/SuccessModal";

const SignUpPage: React.FC = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // ✨ 모달 상태 추가

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const requestData: SignUpRequest = { loginId, email, password, nickname };

    try {
      await api.post("/api/v1/auth/signup", requestData);
      // ✨ alert 대신 모달을 띄우도록 변경
      setIsSuccessModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const errorBody = error.response.data;
          let errorMessage = "회원가입 중 오류가 발생했습니다.";

          if (typeof errorBody.message === "string") {
            errorMessage = errorBody.message;
          } else {
            const validationErrors = errorBody.data || errorBody;
            if (
              typeof validationErrors === "object" &&
              validationErrors !== null
            ) {
              const messages = Object.values(validationErrors).filter(
                (msg) => typeof msg === "string"
              );
              if (messages.length > 0) {
                errorMessage = messages.join("\n");
              }
            }
          }
          alert(errorMessage);
        } else {
          alert("서버와 통신할 수 없습니다.");
        }
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
        console.error("An unexpected signup error occurred:", error);
      }
    }
  };

  return (
    <>
      {" "}
      {/* ✨ 최상위를 Fragment(<>)로 감싸줍니다. */}
      <div className={styles.authContainer}>
        <h1 className={styles.title}>세상에 없던, 당신만의 작은 우주</h1>
        <p className={styles.subtitle}>
          찰나의 생각과 감정들이 모여 당신의 역사가 됩니다.
        </p>
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
              type={isPasswordVisible ? "text" : "password"}
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
              type={isPasswordVisible ? "text" : "password"}
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

          <button type="submit" className={styles.button}>
            우주 만들기
          </button>
        </form>
        <div className={styles.linkContainer}>
          <span>이미 당신의 우주가 있나요?</span>
          <Link to="/login" className={styles.link}>
            우주로 입장하기
          </Link>
        </div>
      </div>
      {/* ✨ 페이지에 SuccessModal 렌더링 */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate("/login")}
        title="회원가입 완료"
        message={
          <>
            세상에 없던 당신만의 우주가 만들어졌습니다.
            <br />
            로그인 후 당신의 감정을 기록해보세요!
          </>
        }
        buttonText="로그인 하러 가기"
      />
    </>
  );
};

export default SignUpPage;
