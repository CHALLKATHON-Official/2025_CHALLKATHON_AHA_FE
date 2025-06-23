import React, { useState, useEffect } from 'react';
import styles from './MainPage.module.css';

// 포스트 데이터의 타입을 정의합니다.
interface Post {
    id: number;
    username: string;
    content: string;
    createdAt: string;
    profileImageUrl: string;
}

// API 연동 전 사용할 임시 가짜 데이터 (Mock Data)
const mockPosts: Post[] = [
    { 
        id: 1, 
        username: '별 헤는 밤', 
        content: '오늘 밤에도 별이 바람에 스치운다.\n고요한 시간 속에 나를 남겨본다.', 
        createdAt: '2025-06-23T22:10:00', 
        profileImageUrl: 'https://i.pravatar.cc/150?u=1' 
    },
    { 
        id: 2, 
        username: '우주 여행자', 
        content: '고요한 우주 속에서 나의 작은 목소리를 기록해본다. 누군가 들어주지 않아도 괜찮아. 이 자체로 의미가 있으니까.', 
        createdAt: '2025-06-23T18:45:00', 
        profileImageUrl: 'https://i.pravatar.cc/150?u=2' 
    },
    { 
        id: 3, 
        username: '은하수', 
        content: '다들 오늘 하루는 어떠셨나요? 저는 오늘 조금 힘들었네요. 그래도 여기에 털어놓으니 한결 나아집니다.', 
        createdAt: '2025-06-23T15:10:00', 
        profileImageUrl: 'https://i.pravatar.cc/150?u=3' 
    },
];

const FeedPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        // 페이지가 로드될 때, 실제 API를 호출하는 대신 가짜 데이터를 사용합니다.
        console.log("피드 데이터를 불러옵니다. (현재는 가짜 데이터)");
        setPosts(mockPosts);
    }, []); // 이 useEffect는 한 번만 실행됩니다.

    return (
        <div className={styles.feedContainer}>
            <main className={styles.postList}>
                {posts.map((post) => (
                    <article key={post.id} className={styles.postCard}>
                        <p className={styles.postContent}>{post.content}</p>
                        <footer className={styles.postFooter}>
                            <div className={styles.authorInfo}>
                                <img src={post.profileImageUrl} alt={post.username} className={styles.profileImage} />
                                <span className={styles.postAuthor}>{post.username}</span>
                            </div>
                            <span className={styles.postTimestamp}>{new Date(post.createdAt).toLocaleString()}</span>
                        </footer>
                    </article>
                ))}
            </main>
        </div>
    );
};

export default FeedPage;