import React from "react";
import styles from "./TimelineCard.module.css";
import type { TimelineEntry } from "../types";

interface TimelineCardProps {
  entry: TimelineEntry;
  onTagClick: (tagName: string) => void;
  // 👇 현재 선택된 태그를 props로 받기 위해 추가합니다.
  selectedTag: string | null;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ entry, onTagClick, selectedTag }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <article className={styles.card}>
      <p className={styles.content}>{entry.content}</p>
      
      <footer className={styles.footer}>
        <div className={styles.tagsContainer}>
          {entry.tags && entry.tags.map((tag, index) => (
            <span 
              key={index} 
              // 👇 현재 태그가 선택된 태그와 같다면 'selected' 클래스를 추가합니다.
              className={`${styles.tag} ${tag === selectedTag ? styles.selected : ''}`}
              onClick={() => onTagClick(tag)}
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className={styles.timestamp}>{formatDate(entry.originalCreatedAt)}의 기록</span>
      </footer>
    </article>
  );
};

export default TimelineCard;