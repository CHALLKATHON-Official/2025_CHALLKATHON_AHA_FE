import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axiosInstance";
import styles from "./TimelinePage.module.css";
import type { TimelineEntry } from "../types";
import TimelineCard from "../components/TimelineCard";

const TIME_SLOTS = {
  "새벽 (0-6시)": ["EARLY_DAWN", "LATE_DAWN"],
  "아침 (6-12시)": ["MORNING"],
  "낮 (12-18시)": ["AFTERNOON"],
  "밤 (18-24시)": ["EVENING"],
};

const TimelinePage: React.FC = () => {
  const [selectedSlotKey, setSelectedSlotKey] = useState(
    Object.keys(TIME_SLOTS)[0]
  );
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastEntryElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 데이터 로딩 useEffect
  useEffect(() => {
    if (loading || !hasMore) return;

    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const timeSlotParam =
          TIME_SLOTS[selectedSlotKey as keyof typeof TIME_SLOTS][0];
        const response = await api.get("/api/v1/timeline", {
          params: { timeSlot: timeSlotParam, page, size: 15 },
        });
        const data = response.data.data;
        setEntries((prev) =>
          page === 0 ? data.content : [...prev, ...data.content]
        );
        setHasMore(!data.last);
      } catch (error) {
        console.error("타임라인 데이터를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [page, selectedSlotKey]);

  // 탭 변경 시 상태 리셋 useEffect
  useEffect(() => {
    setEntries([]);
    setHasMore(true);
    setPage(0);
  }, [selectedSlotKey]);

  return (
    <div className={styles.timelineContainer}>
      <header className={styles.header}>
        <h1>공감 연대기</h1>
        <p>같은 시간을 지나온 익명의 기록들 속에서 잠시 쉬어가세요.</p>
      </header>

      <div className={styles.tabs}>
        {Object.keys(TIME_SLOTS).map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${
              selectedSlotKey === key ? styles.active : ""
            }`}
            onClick={() => setSelectedSlotKey(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <main className={styles.entryList}>
        {entries.map((entry, index) => {
          if (entries.length === index + 1) {
            return (
              <div ref={lastEntryElementRef} key={entry.entryId}>
                <TimelineCard entry={entry} />
              </div>
            );
          }
          return <TimelineCard key={entry.entryId} entry={entry} />;
        })}
      </main>

      {loading && <p className={styles.loading}>기록을 불러오는 중...</p>}
      {!loading && !hasMore && entries.length > 0 && (
        <p className={styles.endOfList}>마지막 기록입니다.</p>
      )}
      {!loading && entries.length === 0 && (
        <p className={styles.endOfList}>아직 쌓인 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default TimelinePage;
