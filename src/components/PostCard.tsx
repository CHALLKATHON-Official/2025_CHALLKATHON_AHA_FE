import React from "react";
import styles from "./PostCard.module.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import type { PostData } from "../types";

interface PostCardProps {
  post: PostData;
  onToggleEcho: (postId: number) => void;
  onTagClick: (tagName: string) => void;
  // onConsentToggle은 이제 PostCard에서 사용하지 않으므로 제거합니다.
}

const PostCard: React.FC<Omit<PostCardProps, 'onConsentToggle'>> = ({
  post,
  onToggleEcho,
  onTagClick,
}) => {
  const getProfileImageUrl = () => {
    // 👇 로직 수정: 백엔드가 보내준 URL이 있으면 사용하고, 없으면(null) 랜덤 이미지를 사용합니다.
    if (post.authorProfileImageUrl) {
      // 실명 글 & 프로필 이미지 있는 경우
      return `http://localhost:8080${post.authorProfileImageUrl}`;
    }
    // 익명 글 또는 프로필 이미지 없는 실명 글의 경우
    return `https://i.pravatar.cc/150?u=${post.postId}`; // postId 기반의 랜덤 아바타
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // pravatar 또는 서버 이미지 로드 실패 시 기본 이미지로 대체
    e.currentTarget.src = '/default-profile.png';
  };

  return (
    <article className={styles.postCard}>
      <header className={styles.postHeader}>
        <img
          src={getProfileImageUrl()}
          alt={post.authorNickname}
          className={styles.profileImage}
          onError={handleImageError}
        />
        <span className={styles.postAuthor}>{post.authorNickname}</span>
      </header>

      <p className={styles.postContent}>{post.content}</p>
      
      <footer className={styles.postFooter}>
        <div className={styles.tagsContainer}>
          {post.tags &&
            post.tags.map((tag, index) => (
              <span
                key={index}
                className={styles.tag}
                onClick={() => onTagClick(tag)}
              >
                #{tag}
              </span>
            ))}
        </div>

        <div className={styles.actionsContainer}>
          <span className={styles.postTimestamp}>
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => onToggleEcho(post.postId)}
            className={styles.echoButton}
          >
            {post.isEchoed ? <FaHeart color="#e11d48" /> : <FaRegHeart />}
            <span>{post.echoCount}</span>
          </button>
        </div>
      </footer>
    </article>
  );
};

export default PostCard;