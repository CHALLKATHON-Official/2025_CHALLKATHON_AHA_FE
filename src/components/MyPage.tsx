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
  // ✨ 이미지 URL을 위한 상태를 별도로 관리하여 캐시 문제를 해결합니다.
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/v1/mypage");
        const profileData = response.data.data;
        setProfile(profileData);
        setNewNickname(profileData.nickname || "");

        // ✨ 서버에서 받은 이미지 URL을 상태에 저장합니다.
        if (profileData.profileImageUrl) {
          // ✨ 캐시 방지를 위해 타임스탬프를 쿼리 파라미터로 추가합니다.
          setImageUrl(
            `http://localhost:8080${
              profileData.profileImageUrl
            }?t=${new Date().getTime()}`
          );
        } else {
          setImageUrl("/default-profile.png");
        }
      } catch (error) {
        console.error("프로필 정보를 불러오는 데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleNicknameUpdate = async () => {
    if (!profile || newNickname === profile.nickname) return;

    try {
      await api.patch("/api/v1/mypage/username", { nickname: newNickname });
      setProfile((prev) => (prev ? { ...prev, nickname: newNickname } : null));
      alert("닉네임이 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      alert("닉네임 변경에 실패했습니다.");
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
        const newImageUrlPath = response.data.data;
        console.log("백엔드로부터 받은 새 경로: ", newImageUrlPath);

        // ✨ 새로운 이미지 URL로 상태를 업데이트하며 캐시를 무력화합니다.
        const newFullUrl = `http://localhost:8080${newImageUrlPath}?t=${new Date().getTime()}`;
        console.log("state에 적용될 새로운 URL: ", newFullUrl);
        setImageUrl(newFullUrl);

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
    e.currentTarget.src = "/default-profile.png";
  };

  // ... (로딩 및 프로필 없을 때의 UI는 그대로 유지)
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
          {/* ✨ imageUrl 상태를 사용하도록 변경 */}
          <img
            src={imageUrl || "/default-profile.png"}
            alt="Profile"
            className={styles.profileImage}
            onError={handleImageError}
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
