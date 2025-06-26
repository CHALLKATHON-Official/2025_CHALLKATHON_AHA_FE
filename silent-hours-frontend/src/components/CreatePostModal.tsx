// src/components/CreatePostModal.tsx
import React, { useState, useEffect } from 'react';
import styles from './CreatePostModal.module.css';
import api from '../api/axiosInstance';
import type { EmotionTag, SilentPostCreateRequest } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  // AI 연동 전까지 더미 감정 태그 목록을 초기화합니다.
  const [availableTags, setAvailableTags] = useState<EmotionTag[]>([]); 
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false); // 익명 여부 상태
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // AI 연동 전까지 사용할 더미 감정 태그 목록
      setAvailableTags([
        { id: 1, tagName: '행복' },
        { id: 2, tagName: '슬픔' },
        { id: 3, tagName: '분노' },
        { id: 4, tagName: '기쁨' },
        { id: 5, tagName: '불안' },
        { id: 6, tagName: '평온' },
      ]);
    }
  }, [isOpen]);

  const handleTagClick = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (content.trim().length === 0) {
      setError('내용을 입력해주세요.');
      return;
    }

    try {
      // 백엔드로 전송할 데이터 객체 구성
      const postData: SilentPostCreateRequest = {
        content: content,
        // AI 연동 전까지 더미 값으로 고정된 감정 태그 ID를 보냅니다.
        // 백엔드 DB에 EmotionTag ID 1과 2가 존재해야 합니다.
        emotionTagIds: [1, 2], 
        isAnonymous: isAnonymous, // 익명 토글 상태 반영
      };
      
      await api.post('/api/v1/posts', postData); // 백엔드 API 호출
      onPostCreated(); // 게시물 생성 성공 시 콜백 호출
      handleClose(); // 모달 닫기
    } catch (err) {
      console.error('포스트 작성에 실패했습니다.', err);
      // 'Network Error'는 서버 연결 문제를 의미하며, 사용자에게 더 명확하게 안내합니다.
      setError('작성에 실패했습니다. 서버가 실행 중이거나 로그인 상태를 확인해주세요.');
    }
  };
  
  const handleClose = () => {
    setContent('');
    setSelectedTagIds([]);
    setIsAnonymous(false); // 모달 닫을 때 익명 상태 초기화
    setError('');
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
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 당신의 우주에는 어떤 이야기가 떠다니나요?"
            required
          />
          <div className={styles.tagSelection}>
            <p>지금의 감정을 선택해주세요. (1개 이상)</p>
            <div className={styles.tagContainer}>
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagClick(tag.id)}
                  className={`${styles.tag} ${selectedTagIds.includes(tag.id) ? styles.selected : ''}`}
                >
                  {tag.tagName}
                </button>
              ))}
            </div>
          </div>
          
          {/* 익명 토글 스위치 UI */}
          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>익명으로 작성</span>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={() => setIsAnonymous(!isAnonymous)} 
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>기록하기</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
