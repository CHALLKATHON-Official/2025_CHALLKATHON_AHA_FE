// src/components/PostCard.tsx
import React from 'react';
import styles from './PostCard.module.css';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import type { PostData } from '../types';

interface PostCardProps {
    post: PostData;
    onToggleEcho: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onToggleEcho }) => {
    // 익명 여부에 따라 프로필 이미지와 닉네임 처리
    const authorNicknameToDisplay = post.isAnonymous ? "익명" : post.authorNickname;
    const profileImageUrlToDisplay = post.isAnonymous 
        ? `https://placehold.co/150x150/503d7e/ffffff?text=Anon` // 익명 전용 기본 이미지 (예시: 회색 배경에 "Anon" 텍스트)
        : (post.authorProfileImageUrl === 'default_image_url'
            ? `https://i.pravatar.cc/150?u=${post.postId}` // 기존 기본 이미지 (랜덤 아바타)
            : `http://localhost:8080${post.authorProfileImageUrl}`); // 실제 이미지 URL

    return (
        <article className={styles.postCard}>
            {/* 상단 작성자 정보 */}
            <header className={styles.postHeader}>
                <img src={profileImageUrlToDisplay} alt={authorNicknameToDisplay} className={styles.profileImage} />
                <span className={styles.postAuthor}>{authorNicknameToDisplay}</span>
            </header>

            <p className={styles.postContent}>{post.content}</p>
            <footer className={styles.postFooter}>
                <div className={styles.tagsContainer}>
                    {/* 감정 태그를 표시합니다. */}
                    {post.tags && post.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span> // key는 고유한 값으로 (여기서는 index 사용)
                    ))}
                </div>
                <div className={styles.actionsContainer}>
                     <span className={styles.postTimestamp}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => onToggleEcho(post.postId)} className={styles.echoButton}>
                        {post.isEchoed ? <FaHeart color="#e11d48" /> : <FaRegHeart />}
                        <span>{post.echoCount}</span>
                    </button>
                </div>
            </footer>
        </article>
    );
};

export default PostCard;
