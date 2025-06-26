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
  const [selectedSlotKey, setSelectedSlotKey] = useState(Object.keys(TIME_SLOTS)[0]);
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const fetchTimeline = useCallback(async (pageNum: number, slotKey: string, tagName: string | null) => {
    if (loadingRef.current) return;
    setLoading(true);

    try {
      const timeSlotsValues = TIME_SLOTS[slotKey as keyof typeof TIME_SLOTS];
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('size', '15');
      timeSlotsValues.forEach(slot => params.append('timeSlots', slot));
      
      if (tagName) {
        params.append('tagName', tagName);
      }

      const response = await api.get("/api/v1/timeline", { params });
      
      const pageData = response.data.data;
      const newEntries = pageData.content || []; 

      setEntries(prev => (pageNum === 0 ? newEntries : [...prev, ...newEntries]));
      setHasMore(!pageData.last);

    } catch (error) {
      console.error("타임라인 데이터를 불러오는 데 실패했습니다:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setEntries([]);
    setPage(0);
    setHasMore(true);
    fetchTimeline(0, selectedSlotKey, selectedTag);
  }, [selectedSlotKey, selectedTag, fetchTimeline]);

  useEffect(() => {
    if (page > 0) {
      fetchTimeline(page, selectedSlotKey, selectedTag);
    }
  }, [page, fetchTimeline]);

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

  const handleTagClick = (tagName: string) => {
    setSelectedTag(prev => prev === tagName ? null : tagName);
  };
  
  return (
    <div className={styles.timelineContainer}>
      <header className={styles.header}>
        <h1>공감 연대기</h1>
        <p>같은 시간을 지나온 익명의 기록들 속에서 잠시 쉬어가세요.</p>
      </header>
      
      {selectedTag && (
        <div className={styles.filterHeader}>
          <h2 className={styles.title}>
            <span className={styles.tagHighlight}>#{selectedTag}</span>
            <span> 감정 모아보기</span>
          </h2>
          {/* 👇 "전체 기록 보기" 버튼을 렌더링하는 부분을 삭제했습니다. */}
        </div>
      )}

      <div className={styles.tabs}>
        {Object.keys(TIME_SLOTS).map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${selectedSlotKey === key ? styles.active : ""}`}
            // 태그가 선택된 상태에서 시간대 탭을 누르면 태그 필터링이 해제되도록 수정
            onClick={() => {
              setSelectedSlotKey(key);
              setSelectedTag(null); 
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <main className={styles.entryList}>
        {entries.map((entry, index) => {
          const cardProps = {
            key: entry.entryId,
            entry: entry,
            onTagClick: handleTagClick,
            // 👇 현재 선택된 태그(selectedTag)를 props로 전달합니다.
            selectedTag: selectedTag
          };

          if (entries.length === index + 1) {
            return (
              <div ref={lastEntryElementRef} key={entry.entryId}>
                <TimelineCard {...cardProps} />
              </div>
            );
          }
          return <TimelineCard {...cardProps} />;
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