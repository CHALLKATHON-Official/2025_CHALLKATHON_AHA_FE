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
    if (loading || !hasMore) return;

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>나의 연대기</h1>
        <p>당신이 남긴 감정의 조각들이 모여 하나의 역사가 됩니다.</p>
      </header>

      <main className={styles.postList}>
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.postId}>
                <PostCard post={post} onToggleEcho={handleToggleEcho} />
              </div>
            );
          }
          return (
            <PostCard
              key={post.postId}
              post={post}
              onToggleEcho={handleToggleEcho}
            />
          );
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
