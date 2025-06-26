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
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/v1/mypage");
        const profileData = response.data.data;
        setProfile(profileData);
        setNewNickname(profileData.nickname || "");
        
        if (profileData.profileImageUrl) {
            // 👇 캐시 무력화를 위해 URL에 타임스탬프를 추가합니다.
            setImageUrl(`http://localhost:8080${profileData.profileImageUrl}?t=${new Date().getTime()}`);
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
        await api.patch('/api/v1/mypage/username', { nickname: newNickname });
        alert('닉네임이 성공적으로 변경되었습니다.');
        setProfile(prev => prev ? {...prev, nickname: newNickname} : null);
    } catch (error) {
        console.error('닉네임 변경 실패:', error);
        alert('닉네임 변경에 실패했습니다.');
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
        // 👇 headers 옵션을 완전히 제거합니다.
        const response = await api.post(
          "/api/v1/mypage/profile-image",
          formData
        );
        const newImagePath = response.data.data;
        
        const newFullUrl = `http://localhost:8080${newImagePath}?t=${new Date().getTime()}`;
        setImageUrl(newFullUrl);

        alert("프로필 이미지가 성공적으로 변경되었습니다.");
      } catch (error) {
        console.error("프로필 이미지 변경 실패:", error);
        alert("프로필 이미지 변경에 실패했습니다. (파일 크기는 5MB 이하)");
      }
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/default-profile.png";
  };
  
  if (isLoading) return <div className={styles.container}><p>로딩 중...</p></div>;
  if (!profile) return <div className={styles.container}><p>프로필 정보를 불러올 수 없습니다.</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h1>마이페이지</h1>
        <div
          className={styles.imageContainer}
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            key={imageUrl} // key를 추가하여 상태 변경 시 img 태그를 강제로 다시 렌더링합니다.
            src={imageUrl || "/default-profile.png"}
            alt="Profile"
            className={styles.profileImage}
            onError={handleImageError}
          />
          <div className={styles.cameraIconOverlay}><FiCamera size={24} /></div>
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
            <p id="email" className={styles.emailText}>{profile.email}</p>
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
