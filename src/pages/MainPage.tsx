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
            const newPosts: PostData[] = (response.data?.data?.content || []).map((post: any) => ({
                ...post,
                isEchoed: post.isEchoed || false 
            }));

            if (isRefresh) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }
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
        window.addEventListener('post-created', handleRefresh);
        fetchPosts(true); // 초기 로딩
        return () => window.removeEventListener('post-created', handleRefresh);
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
        }
    };

    return (
        // ✨ 새로운 feedContainer 클래스 적용
        <div className={styles.feedContainer}>
            <header className={styles.feedHeader}>
                <h2>Anonymous messages</h2>
                <p>For emotional messages</p>
            </header>
            
            {/* ✨ postList 클래스를 그리드 레이아웃으로 변경 */}
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