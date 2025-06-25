import React, { useState, useEffect, useRef } from 'react';
import styles from './CreatePostModal.module.css';
import api from '../api/axiosInstance';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [emotionTags, setEmotionTags] = useState<{ id: number; tagName: string }[]>([]);
  // 사용자가 실제로 선택한 태그
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  // 태그 관련 useEffect와 상태들 삭제
  // 👇 state들 추가 (useState 있는 곳 아래에 이어서)
  const [analyzedTags, setAnalyzedTags] = useState<{ id: number; tagName: string }[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);



 




  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const newContent = e.target.value;
  setContent(newContent);

  // 💥 타이핑 시작하면 기존 감정 태그 제거!
  if (emotionTags.length > 0) {
    setEmotionTags([]);
    setSelectedTags([]);
  }

  // 기존 타이머 초기화
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  // 2초 동안 입력 없으면 감정 분석 요청
  typingTimeoutRef.current = setTimeout(() => {
    if (newContent.trim().length > 0) {
      analyzeEmotion(newContent);
    }
  }, 2000);
};

  const analyzeEmotion = async (text: string) => {
    try {
      const response = await api.post('/api/v1/emotions/analyze', { content: text });
      setEmotionTags(response.data); // [{ id, tagName }, ...]
      console.log('감정 분석 결과:', response.data);
    } catch (err) {
      console.error('감정 분석 실패:', err);
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
    setError('');

    if (content.trim().length === 0) {
      setError('내용을 입력해주세요.');
      return;
    }
    // 태그 선택 유효성 검사 
    if (selectedTags.length === 0) {
      setError('감정 태그를 최소 1개 이상 선택해주세요.');
      return;
    }

    try {
      // API 요청 시 content와 감정태그 전송
      await api.post('/api/v1/posts', {
        content: content,
        emotionTagIds: selectedTags,
      });
      onPostCreated();
      handleClose();
    } catch (err) {
      console.error('포스트 작성에 실패했습니다.', err);
      setError('작성에 실패했습니다. 로그인 상태를 확인해주세요.');
    }
  };

  const handleClose = () => {
    setContent('');
    setError('');
    setEmotionTags([]);
    setSelectedTags([]);
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
            // onChange={(e) => setContent(e.target.value)}
            onChange={handleContentChange}
            placeholder="오늘 당신의 우주에는 어떤 이야기가 떠다니나요?"
            required
          />
          {emotionTags.length > 0 && (
            <div className={styles.tagContainer}>
              <p>감정 태그를 선택해 주세요 (1개 이상):</p>
              <div className={styles.tagList}>
                {emotionTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`${styles.tagButton} ${selectedTags.includes(tag.id) ? styles.selected : ''}`}
                    onClick={() => toggleTagSelection(tag.id)}
                  >
                    {tag.tagName}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* 태그 선택 UI 모두 삭제 */}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>기록하기</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
