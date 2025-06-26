import React from "react";
import styles from "./TimelineCard.module.css";
import type { TimelineEntry } from "../types";

interface TimelineCardProps {
  entry: TimelineEntry;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ entry }) => {
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
        <span>{formatDate(entry.originalCreatedAt)}의 기록</span>
      </footer>
    </article>
  );
};

export default TimelineCard;
