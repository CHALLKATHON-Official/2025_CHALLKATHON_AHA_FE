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
  const [emotionTags, setEmotionTags] = useState<{ id: number; tagName: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  // ✨ 아카이빙 동의 상태를 추가하고 기본값을 true로 설정합니다.
  const [consentToArchive, setConsentToArchive] = useState(true);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (emotionTags.length > 0) {
      setEmotionTags([]);
      setSelectedTags([]);
    }
    if (isAnalyzing) setIsAnalyzing(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (newContent.trim().length > 0) {
        analyzeEmotion(newContent);
      }
    }, 2000);
  };

  const analyzeEmotion = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const response = await api.post("/api/v1/emotions/analyze", { content: text });
      // 백엔드 응답이 response.data.data에 담겨있을 수 있으므로 확인
      setEmotionTags(response.data.data || response.data);
    } catch (err) {
      console.error("감정 분석 실패:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleTagSelection = (tagId: number) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
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
      // ✨ API 요청 시 consentToArchive 값을 함께 전송합니다.
      await api.post("/api/v1/posts", {
        content: content,
        emotionTagIds: selectedTags,
        isAnonymous: isAnonymous,
        consentToArchive: consentToArchive, // ✨ 추가된 필드
      });
      onPostCreated();
      handleClose();
    } catch (err) {
      console.error("포스트 작성에 실패했습니다.", err);
      setError("작성에 실패했습니다. 로그인 상태를 확인해주세요.");
    }
  };

  const handleClose = () => {
    setContent("");
    setError("");
    setEmotionTags([]);
    setSelectedTags([]);
    setIsAnalyzing(false);
    setIsAnonymous(true); // 익명 상태 초기화
    setConsentToArchive(true); // 아카이빙 동의 상태 초기화
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        <h2>당신의 감정을 기록해보세요</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={handleContentChange}
            placeholder="오늘 당신의 우주에는 어떤 이야기가 떠다니나요?"
            required
          />

          {isAnalyzing ? (
            <div className={styles.analyzingContainer}>
              <div className={styles.spinner}></div>
              <span>AI가 감정을 분석하고 있어요...</span>
            </div>
          ) : (
            emotionTags.length > 0 && (
              <div className={styles.tagContainer}>
                <p className={styles.tagInfoText}>감정 태그를 선택해 주세요 (1개 이상):</p>
                <div className={styles.tagList}>
                  {emotionTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className={`${styles.tagButton} ${selectedTags.includes(tag.id) ? styles.selected : ""}`}
                      onClick={() => toggleTagSelection(tag.id)}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
          
          {/* ✨ 토글 버튼들을 그룹으로 묶습니다. */}
          <div className={styles.toggleGroup}>
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
            
            {/* ✨ 아카이빙 동의 토글 버튼 추가 */}
            <div className={styles.toggleContainer}>
              <span>아카이빙 비동의</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={consentToArchive}
                  onChange={() => setConsentToArchive(!consentToArchive)}
                />
                <span className={styles.slider}></span>
              </label>
              <span>아카이빙 동의</span>
            </div>
          </div>


          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>기록하기</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
