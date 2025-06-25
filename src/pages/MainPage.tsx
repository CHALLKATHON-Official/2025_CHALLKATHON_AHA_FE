import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./MainPage.module.css";
import api from "../api/axiosInstance";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { PostData } from "../types";

const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isLoggedIn } = useAuth();

  // IntersectionObserver 로직
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

  // 데이터 로딩을 위한 useEffect
  useEffect(() => {
    // 로딩 중이거나 더 이상 데이터가 없으면 중단
    if (loading || !hasMore) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/v1/posts", {
          params: { page, size: 10, sort: "createdAt,desc" },
        });
        const data = response.data?.data;
        const newPosts = data?.content || [];

        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(!data.last);
      } catch (error) {
        console.error("피드 데이터를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]); // 'page'가 변경될 때만 이 effect 실행

  // 새로고침 및 초기 로딩을 위한 useEffect
  useEffect(() => {
    const handleRefresh = () => {
      setPosts([]);
      setHasMore(true);
      setPage(0);
    };

    handleRefresh(); // 초기 로딩 시 실행

    window.addEventListener("post-created", handleRefresh);
    return () => window.removeEventListener("post-created", handleRefresh);
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const handleToggleEcho = async (postId: number) => {
    if (!isLoggedIn) return alert("로그인이 필요한 기능입니다.");
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
    <div className={styles.feedContainer}>
      <header className={styles.feedHeader}>
        <h2>Anonymous messages</h2>
        <p>For emotional messages</p>
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

      {loading && <p>Loading more...</p>}
      {!loading && !hasMore && posts.length > 0 && <p>마지막 게시물입니다.</p>}
      {!loading && posts.length === 0 && <p>표시할 게시물이 없습니다.</p>}
    </div>
  );
};

export default MainPage;
