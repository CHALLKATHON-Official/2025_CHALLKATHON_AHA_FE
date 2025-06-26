import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import PostCard from "../components/PostCard";
import styles from "./MainPage.module.css";
import type { PostData } from "../types";
import { useAuth } from "../context/AuthContext";

const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        let response;
        if (selectedTag) {
          response = await api.get(
            `/api/v1/posts/tags/${encodeURIComponent(selectedTag)}`
          );
        } else {
          response = await api.get("/api/v1/posts"); // 페이지네이션이 적용된 전체 피드
        }
        const responseData =
          response.data.data?.content || response.data.data || [];
        setPosts(Array.isArray(responseData) ? responseData : []);
      } catch (error) {
        console.error("게시물을 불러오는 데 실패했습니다:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTag]);

  const handleToggleEcho = async (postId: number) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await api.post(`/api/v1/posts/${postId}/echo`);
      const { echoCount, isEchoed } = response.data.data;
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.postId === postId ? { ...p, isEchoed, echoCount } : p
        )
      );
    } catch (error) {
      console.error("메아리 토글 실패:", error);
    }
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName === selectedTag ? null : tagName);
  };

  const handleClearFilter = () => {
    setSelectedTag(null);
  };

  const handleConsentToggle = async (postId: number) => {
    // 이미 동의한 게시물에 대한 중복 요청 방지
    const targetPost = posts.find((p) => p.postId === postId);
    if (!targetPost || targetPost.consentToArchive) return;

    try {
      await api.patch(`/api/v1/posts/${postId}/consent`);
      // 성공 시 화면 상태 즉시 업데이트
      setPosts(
        posts.map((p) =>
          p.postId === postId ? { ...p, consentToArchive: true } : p
        )
      );
      alert("아카이빙에 동의 처리되었습니다.");
    } catch (error) {
      console.error("아카이빙 동의 처리 중 오류 발생:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>게시물을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {selectedTag && (
        <div className={styles.filterHeader}>
          <h1 className={styles.title}>
            <span className={styles.tagHighlight}>#{selectedTag}</span>
            <span> 감정 모아보기</span>
          </h1>
          <button onClick={handleClearFilter} className={styles.clearButton}>
            전체 피드 보기
          </button>
        </div>
      )}

      <div className={styles.postList}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onToggleEcho={handleToggleEcho}
              onTagClick={handleTagClick}
              onConsentToggle={handleConsentToggle}
            />
          ))
        ) : (
          <p className={styles.message}>
            {selectedTag
              ? "이 감정에 대한 게시물이 아직 없습니다."
              : "아직 작성된 글이 없습니다."}
          </p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
