import React, { useState } from 'react';
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

  // 태그 관련 useEffect와 상태들 삭제

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (content.trim().length === 0) {
      setError('내용을 입력해주세요.');
      return;
    }
    // 태그 선택 유효성 검사 삭제

    try {
      // API 요청 시 content만 전송
      await api.post('/api/v1/posts', {
        content: content,
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
          {/* 태그 선택 UI 모두 삭제 */}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>기록하기</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
