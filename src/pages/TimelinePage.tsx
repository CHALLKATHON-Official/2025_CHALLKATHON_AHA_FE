import React, { useState, useEffect } from "react";
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
  const [page, setPage] = useState(0); // 페이지 상태는 유지 (추후 무한 스크롤 대비)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✨ 데이터 로딩 로직을 useEffect 안으로 통합하여 안정화
  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      // 탭을 누를 때마다 항상 첫 페이지부터 새로 로드
      try {
        const timeSlotParam =
          TIME_SLOTS[selectedSlotKey as keyof typeof TIME_SLOTS][0];

        const response = await api.get("/api/v1/timeline", {
          params: {
            timeSlot: timeSlotParam,
            page: 0, // 항상 첫 페이지(0)부터 조회
            size: 15,
          },
        });

        const data = response.data.data;
        setEntries(data.content); // 기존 데이터를 덮어쓰기
        setHasMore(!data.last);
        setPage(1); // 다음 페이지는 1페이지로 설정
      } catch (error) {
        console.error("타임라인 데이터를 불러오는 데 실패했습니다:", error);
        setEntries([]); // 에러 발생 시 목록 비우기
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
    // ✨ 의존성 배열을 selectedSlotKey만 두어 탭 선택 시에만 실행되도록 변경
  }, [selectedSlotKey]);

  const handleSelectSlot = (slotKey: string) => {
    setSelectedSlotKey(slotKey);
  };

  // 무한 스크롤 로직 (참고용, 현재는 사용되지 않음)
  // const loadMore = () => {
  //   if (!loading && hasMore) {
  //     // fetchTimeline(selectedSlotKey, page) 호출
  //   }
  // };

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
            onClick={() => handleSelectSlot(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <main className={styles.entryList}>
        {entries.map((entry) => (
          <TimelineCard key={entry.entryId} entry={entry} />
        ))}
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
