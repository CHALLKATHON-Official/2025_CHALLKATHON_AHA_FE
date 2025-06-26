import React, { useState, useEffect, useCallback } from "react";
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

  // 1. 데이터 로딩 로직을 useCallback으로 감싸서 불필요한 재실행을 방지합니다.
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedTag) {
        response = await api.get(
          `/api/v1/posts/tags/${encodeURIComponent(selectedTag)}`
        );
      } else {
        response = await api.get("/api/v1/posts");
      }
      const responseData = response.data.data?.content || response.data.data || [];
      setPosts(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error("게시물을 불러오는 데 실패했습니다:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTag]); // selectedTag가 변경될 때만 함수를 새로 생성합니다.

  // 2. selectedTag가 변경되면 게시물을 다시 불러옵니다.
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 3. (핵심) 'post-created' 이벤트를 감지하여 게시물을 새로고침하는 로직을 추가합니다.
  useEffect(() => {
    // 이벤트 핸들러: fetchPosts 함수를 실행합니다.
    const handlePostCreated = () => {
      console.log("새 글 작성 감지! 피드를 새로고침합니다.");
      fetchPosts();
    };

    // 'post-created'라는 이름의 이벤트를 감지하도록 리스너를 추가합니다.
    window.addEventListener('post-created', handlePostCreated);

    // 컴포넌트가 사라질 때(unmount) 이벤트 리스너를 정리하여 메모리 누수를 방지합니다.
    return () => {
      window.removeEventListener('post-created', handlePostCreated);
    };
  }, [fetchPosts]); // fetchPosts 함수가 변경될 때만 이 효과를 재실행합니다.


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

  // onConsentToggle 함수는 더 이상 PostCard에서 사용하지 않으므로 제거해도 괜찮습니다.
  
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