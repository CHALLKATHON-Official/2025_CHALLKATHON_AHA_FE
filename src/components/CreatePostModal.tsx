import React, { useState, useRef } from "react";
import styles from "./CreatePostModal.module.css";
import api from "../api/axiosInstance";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [emotionTags, setEmotionTags] = useState<
    { id: number; tagName: string }[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // AI 분석 상태를 위한 state
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 타이핑 시작 시 기존 태그와 분석 상태 초기화
    if (emotionTags.length > 0) {
      setEmotionTags([]);
      setSelectedTags([]);
    }
    if (isAnalyzing) {
      setIsAnalyzing(false);
    }

    // 기존 타이머 초기화
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 2초 동안 추가 입력이 없으면 감정 분석 요청
    typingTimeoutRef.current = setTimeout(() => {
      if (newContent.trim().length > 0) {
        analyzeEmotion(newContent);
      }
    }, 2000);
  };

  // AI 감정 분석 함수
  const analyzeEmotion = async (text: string) => {
    setIsAnalyzing(true); // 분석 시작 -> 로딩 상태 true
    try {
      const response = await api.post("/api/v1/emotions/analyze", {
        content: text,
      });
      setEmotionTags(response.data);
    } catch (err) {
      console.error("감정 분석 실패:", err);
      // 사용자에게 에러를 알려줄 수 있습니다. 예: setError("감정 분석에 실패했습니다.");
    } finally {
      setIsAnalyzing(false); // 분석 종료 -> 로딩 상태 false
    }
  };

  const toggleTagSelection = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (content.trim().length === 0) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (selectedTags.length === 0) {
      setError("감정 태그를 최소 1개 이상 선택해주세요.");
      return;
    }

    try {
      await api.post("/api/v1/posts", {
        content: content,
        emotionTagIds: selectedTags,
        isAnonymous: isAnonymous,
      });
      onPostCreated();
      handleClose();
    } catch (err) {
      console.error("포스트 작성에 실패했습니다.", err);
      setError("작성에 실패했습니다. 로그인 상태를 확인해주세요.");
    }
  };

  const handleClose = () => {
    // 모달이 닫힐 때 모든 상태를 초기화합니다.
    setContent("");
    setError("");
    setEmotionTags([]);
    setSelectedTags([]);
    setIsAnalyzing(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className={styles.closeButton}>
          &times;
        </button>
        <h2>당신의 감정을 기록해보세요</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={handleContentChange}
            placeholder="오늘 당신의 우주에는 어떤 이야기가 떠다니나요?"
            required
          />

          {/* AI 분석 중일 때 로딩 UI를 표시합니다. */}
          {isAnalyzing ? (
            <div className={styles.analyzingContainer}>
              <div className={styles.spinner}></div>
              <span>AI가 감정을 분석하고 있어요...</span>
            </div>
          ) : (
            emotionTags.length > 0 && (
              <div className={styles.tagContainer}>
                <p className={styles.tagInfoText}>
                  감정 태그를 선택해 주세요 (1개 이상):
                </p>
                <div className={styles.tagList}>
                  {emotionTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className={`${styles.tagButton} ${
                        selectedTags.includes(tag.id) ? styles.selected : ""
                      }`}
                      onClick={() => toggleTagSelection(tag.id)}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          <div className={styles.toggleContainer}>
            <span>닉네임으로 기록</span>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <span className={styles.slider}></span>
            </label>
            <span>익명으로 기록</span>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" className={styles.submitButton}>
            기록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
