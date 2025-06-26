import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./MyChroniclePage.module.css";
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

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/v1/mypage/posts", {
          params: { page, size: 10 },
        });
        const data = response.data?.data;
        setPosts((prev) =>
          page === 0 ? data.content : [...prev, ...data.content]
        );
        setHasMore(!data.last);
      } catch (error) {
        console.error("내 기록을 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [isLoggedIn, page]);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setPage(0);
  }, [isLoggedIn]);

  const handleToggleEcho = async (postId: number) => {
    if (!isLoggedIn) return;
    try {
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

  const handleConsentToggle = async (postId: number) => {
    // 1단계: 함수가 올바른 ID로 호출되었는지 확인
    console.log(`[1] ID [${postId}]의 동의 상태를 변경합니다.`);

    try {
      // 2단계: API를 호출하고, 전체 응답을 확인
      const response = await api.patch(`/api/v1/posts/${postId}/consent`);
      console.log("[2] 백엔드로부터 받은 전체 응답:", response);

      // 3단계: 응답에서 새로운 동의 상태(true 또는 false)를 추출
      const newConsentState = response.data.data;
      console.log(`[3] 백엔드가 반환한 새로운 동의 상태: ${newConsentState}`);

      // 4단계: 상태(state) 업데이트 전후를 비교
      setPosts((currentPosts) => {
        const postBeforeUpdate = currentPosts.find((p) => p.postId === postId);
        console.log("[4] 상태 업데이트 전:", postBeforeUpdate);

        const updatedPosts = currentPosts.map((p) =>
          p.postId === postId ? { ...p, consentToArchive: newConsentState } : p
        );

        const postAfterUpdate = updatedPosts.find((p) => p.postId === postId);
        console.log("[5] 상태 업데이트 후:", postAfterUpdate);

        return updatedPosts;
      });
    } catch (error) {
      console.error("아카이빙 동의 변경 처리 중 오류 발생:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>나의 연대기</h1>
        <p>당신이 남긴 감정의 조각들이 모여 하나의 역사가 됩니다.</p>
      </header>

      <main className={styles.postList}>
        {posts.map((post, index) => {
          const card = (
            <PostCard
              key={post.postId}
              post={post}
              onToggleEcho={handleToggleEcho}
              onTagClick={() => {}}
              onConsentToggle={handleConsentToggle}
            />
          );

          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.postId}>
                {card}
              </div>
            );
          }
          return card;
        })}
      </main>

      {loading && <p className={styles.message}>기록을 불러오는 중...</p>}
      {!loading && !hasMore && posts.length > 0 && (
        <p className={styles.message}>마지막 기록입니다.</p>
      )}
      {!isLoggedIn && <p className={styles.message}>로그인 후 이용해주세요.</p>}
      {isLoggedIn && posts.length === 0 && !loading && (
        <p className={styles.message}>아직 작성한 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default MyChroniclePage;
