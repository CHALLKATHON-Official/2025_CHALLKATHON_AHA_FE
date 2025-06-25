import React from 'react';
import styles from './PostCard.module.css';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import type { PostData } from '../types';

interface PostCardProps {
    post: PostData;
    onToggleEcho: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onToggleEcho }) => {
    const fullProfileImageUrl = post.authorProfileImageUrl === 'default_image_url'
        ? `https://i.pravatar.cc/150?u=${post.postId}`
        : `http://localhost:8080${post.authorProfileImageUrl}`;

    return (
        <article className={styles.postCard}>
            {/* 상단 작성자 정보 */}
            <header className={styles.postHeader}>
                <img src={fullProfileImageUrl} alt={post.authorNickname} className={styles.profileImage} />
                <span className={styles.postAuthor}>{post.authorNickname}</span>
            </header>

            <p className={styles.postContent}>{post.content}</p>
            <footer className={styles.postFooter}>
                {/* ✨ 태그를 표시하던 div를 삭제했습니다. */}
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