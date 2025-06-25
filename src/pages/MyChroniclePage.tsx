import React, { useState, useEffect } from "react";
import styles from "./MyChroniclePage.module.css"; // ✨ 새로운 CSS 모듈 사용
import api from "../api/axiosInstance";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { PostData } from "../types";

const MyChroniclePage: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchMyPosts = async (pageNum: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await api.get("/api/v1/mypage/posts", {
        params: { page: pageNum, size: 10 },
      });
      const newPosts: PostData[] = response.data?.data?.content || [];

      setPosts((prev) => (pageNum === 0 ? newPosts : [...prev, ...newPosts]));
      setHasMore(!response.data.data.last);
    } catch (error) {
      console.error("내 기록을 불러오는 데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyPosts(0);
    }
  }, [isLoggedIn]);

  const handleToggleEcho = async (postId: number) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    try {
      // '메아리' 기능은 메인 페이지와 동일하게 동작
      const response = await api.post(`/api/v1/posts/${postId}/echo`);
      const { echoCount, isEchoed } = response.data.data;
      setPosts(
        posts.map((p) =>
          p.postId === postId ? { ...p, echoCount, isEchoed } : p
        )
      );
    } catch (error) {
      console.error("Echo 처리 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>나의 연대기</h1>
        <p>당신이 남긴 감정의 조각들이 모여 하나의 역사가 됩니다.</p>
      </header>

      <main className={styles.postList}>
        {posts.map((post) => (
          <PostCard
            key={post.postId}
            post={post}
            onToggleEcho={handleToggleEcho}
          />
        ))}
      </main>

      {loading && <p className={styles.message}>기록을 불러오는 중...</p>}
      {!loading && !hasMore && posts.length > 0 && (
        <p className={styles.message}>마지막 기록입니다.</p>
      )}
      {!loading && posts.length === 0 && (
        <p className={styles.message}>아직 작성한 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default MyChroniclePage;
