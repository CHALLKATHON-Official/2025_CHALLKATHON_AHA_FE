import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginConfirmModal.module.css';

interface LoginConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginConfirmModal: React.FC<LoginConfirmModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    navigate('/login');
    onClose(); // 로그인 페이지로 이동 후 모달을 닫습니다.
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <h2>로그인이 필요합니다</h2>
        <p className={styles.message}>
          이 기능을 사용하려면 로그인이 필요합니다.
          <br />
          로그인 페이지로 이동하시겠습니까?
        </p>
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
          <button onClick={handleConfirm} className={styles.confirmButton}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS Module 파일도 함께 생성해야 합니다.
export default LoginConfirmModal;
