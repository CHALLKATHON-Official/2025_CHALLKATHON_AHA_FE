import React from "react";
import styles from "./ErrorModal.module.css";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "확인",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.confirmButton}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
