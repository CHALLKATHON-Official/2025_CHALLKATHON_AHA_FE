import React, { useState, useEffect, useRef } from "react";
import styles from "./MyPage.module.css";
import api from "../api/axiosInstance";
import type { UserProfile } from "../types";
import { FiCamera } from "react-icons/fi";

const MyPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newNickname, setNewNickname] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/v1/mypage");
        setProfile(response.data.data);
        // ✨ 닉네임이 null일 경우 빈 문자열로 처리하여 오류 방지
        setNewNickname(response.data.data.nickname || "");
      } catch (error) {
        console.error("프로필 정보를 불러오는 데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleNicknameUpdate = async () => {
    // ✨ 버튼 비활성화 로직을 현재 닉네임과 profile의 닉네임 비교로 변경
    if (!profile || newNickname === profile.nickname) return;

    try {
      await api.patch("/api/v1/mypage/username", { nickname: newNickname });
      setProfile((prev) => (prev ? { ...prev, nickname: newNickname } : null));
      alert("닉네임이 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      alert("닉네임 변경에 실패했습니다.");
      // ✨ 실패 시 원래 닉네임으로 되돌림
      if (profile) setNewNickname(profile.nickname);
    }
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await api.post(
          "/api/v1/mypage/profile-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const newImageUrl = response.data.data;
        setProfile((prev) =>
          prev ? { ...prev, profileImageUrl: newImageUrl } : null
        );
        alert("프로필 이미지가 성공적으로 변경되었습니다.");
      } catch (error) {
        console.error("프로필 이미지 변경 실패:", error);
        alert("프로필 이미지 변경에 실패했습니다. (파일 크기는 5MB 이하)");
      }
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    // ✨ 이미지 로드 실패 시, 기본 이미지로 확실하게 대체
    e.currentTarget.src = "/default-profile.png";
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <p>프로필 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h1>마이페이지</h1>
        <div
          className={styles.imageContainer}
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={profile.profileImageUrl || "/default-profile.png"}
            alt="Profile"
            className={styles.profileImage}
            onError={handleImageError} // ✨ 이미지 에러 핸들러 추가
          />
          <div className={styles.cameraIconOverlay}>
            <FiCamera size={24} />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfileImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className={styles.infoGroup}>
          <label htmlFor="email">이메일</label>
          <p id="email" className={styles.emailText}>
            {profile.email}
          </p>
        </div>

        <div className={styles.infoGroup}>
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className={styles.nicknameInput}
          />
        </div>

        <button
          onClick={handleNicknameUpdate}
          className={styles.saveButton}
          disabled={!profile || newNickname === profile.nickname}
        >
          닉네임 변경사항 저장
        </button>
      </div>
    </div>
  );
};

export default MyPage;
