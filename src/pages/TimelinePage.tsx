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

  // 1. 데이터 로딩 로직을 useCallback으로 분리하여 재사용 가능하고 안정적인 함수로 만듭니다.
  const fetchTimeline = useCallback(async (pageNum: number, slotKey: string) => {
    if (loading) return; // 중복 요청 방지
    setLoading(true);
    try {
      const timeSlotsValues = TIME_SLOTS[slotKey as keyof typeof TIME_SLOTS];
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('size', '15');
      timeSlotsValues.forEach(slot => params.append('timeSlots', slot));

      const response = await api.get("/api/v1/timeline", { params });
      const data = response.data.data;

      // 페이지 번호가 0이면 새 데이터로 교체(탭 변경), 아니면 기존 데이터에 추가(무한 스크롤)
      setEntries(prev => (pageNum === 0 ? data.content : [...prev, ...data.content]));
      setHasMore(!data.last);
    } catch (error) {
      console.error("타임라인 데이터를 불러오는 데 실패했습니다:", error);
      setEntries([]); // 오류 발생 시 목록 비우기
    } finally {
      setLoading(false);
    }
  }, [loading]); // loading 상태가 바뀔 때만 함수를 재생성합니다.

  // 2. 탭(selectedSlotKey)이 변경될 때만 실행되는 useEffect
  useEffect(() => {
    // 상태를 초기화하고 첫 페이지(0) 데이터를 즉시 불러옵니다.
    setEntries([]);
    setPage(0);
    setHasMore(true);
    fetchTimeline(0, selectedSlotKey);
  }, [selectedSlotKey]); // selectedSlotKey가 변경될 때만 실행됩니다.

  // 3. 무한 스크롤을 위한 useEffect (페이지 번호 변경 시)
  const observer = useRef<IntersectionObserver | null>(null);
  const lastEntryElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // 페이지 번호를 증가시켜 다음 페이지를 로드합니다.
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  // 4. 페이지 번호가 0보다 클 때(무한 스크롤 시) 추가 데이터를 로드하는 useEffect
  useEffect(() => {
    if (page > 0) {
      fetchTimeline(page, selectedSlotKey);
    }
  }, [page]); // page가 변경될 때만 실행됩니다.

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
            className={`${styles.tab} ${selectedSlotKey === key ? styles.active : ""}`}
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