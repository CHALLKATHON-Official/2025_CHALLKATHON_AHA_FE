// src/pages/MainPage.tsx
import React, { useState, useEffect } from 'react';
import styles from './MainPage.module.css';
import api from '../api/axiosInstance';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import type { PostData } from '../types';


const MainPage: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useAuth(); // 로그인 상태 확인

    const fetchPosts = async (isRefresh = false) => {
        if (loading && !isRefresh) return;
        setLoading(true);
        try {
            const nextPage = isRefresh ? 0 : page;
            const response = await api.get('/api/v1/posts', {
                params: { page: nextPage, size: 10, sort: 'createdAt,desc' }
            });
            // 백엔드 응답에서 isAnonymous와 tags 필드를 매핑합니다.
            const newPosts: PostData[] = (response.data?.data?.content || []).map((post: any) => ({
                ...post,
                isEchoed: post.isEchoed || false, 
                isAnonymous: post.isAnonymous || false, 
                tags: post.tags || [] 
            }));

            if (isRefresh) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }
            // 새로운 게시물이 있다면 다음 페이지를 준비합니다.
            if (newPosts.length > 0) {
              setPage(nextPage + 1);
            }
        } catch (error) {
            console.error("피드 데이터를 불러오는 데 실패했습니다:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleRefresh = () => fetchPosts(true);
        // 'post-created' 이벤트 리스너를 추가하여 새 글 작성 시 피드를 새로고침합니다.
        window.addEventListener('post-created', handleRefresh);
        fetchPosts(true); // 컴포넌트 마운트 시 초기 게시물 로딩
        return () => window.removeEventListener('post-created', handleRefresh); // 클린업
    }, []);

    const handleToggleEcho = async (postId: number) => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }
        try {
            const response = await api.post(`/api/v1/posts/${postId}/echo`);
            const { echoCount, isEchoed } = response.data.data;
            setPosts(posts.map(p =>
                p.postId === postId ? { ...p, echoCount, isEchoed } : p
            ));
        } catch (error) {
            console.error("Echo 처리 중 오류 발생:", error);
            alert("메아리 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.feedContainer}>
            <header className={styles.feedHeader}>
                <h2>Anonymous messages</h2>
                <p>For emotional messages</p>
            </header>
            
            <main className={styles.postList}>
                {posts.map((post) => (
                    <PostCard key={post.postId} post={post} onToggleEcho={handleToggleEcho} />
                ))}
            </main>

            {loading && <p>Loading more...</p>}
            {!loading && posts.length === 0 && <p>표시할 게시물이 없습니다.</p>}
        </div>
    );
};

export default MainPage;
