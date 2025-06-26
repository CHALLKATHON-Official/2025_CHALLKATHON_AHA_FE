import React from "react";
import styles from "./PostCard.module.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import type { PostData } from "../types";

interface PostCardProps {
  post: PostData;
  onToggleEcho: (postId: number) => void;
  onTagClick: (tagName: string) => void;
  onConsentToggle: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleEcho,
  onTagClick,
  onConsentToggle,
}) => {
  const fullProfileImageUrl =
    post.authorProfileImageUrl === "default_image_url"
      ? `https://i.pravatar.cc/150?u=${post.postId}`
      : `http://localhost:8080${post.authorProfileImageUrl}`;

  return (
    <article className={styles.postCard}>
      <header className={styles.postHeader}>
        <img
          src={fullProfileImageUrl}
          alt={post.authorNickname}
          className={styles.profileImage}
        />
        <span className={styles.postAuthor}>{post.authorNickname}</span>
      </header>

      <p className={styles.postContent}>{post.content}</p>

      <div className={styles.archiveConsentContainer}>
        <span>공감 연대기에 기록 남기기</span>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={post.consentToArchive}
            onChange={() => onConsentToggle(post.postId)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
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
