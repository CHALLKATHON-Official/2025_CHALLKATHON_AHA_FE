import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";
import { FiMenu } from "react-icons/fi";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* 1. 왼쪽 영역: 메뉴 버튼과 로고가 함께 위치하도록 수정 */}
        <div className={styles.headerLeft}>
          <button className={styles.menuButton} onClick={onMenuClick}>
            <FiMenu size={24} />
          </button>
          <Link to="/" className={styles.logo}>
            Silent Hour
          </Link>
        </div>

        {/* 2. 중앙 영역은 삭제합니다. */}

        {/* 3. 오른쪽 영역 */}
        <div className={styles.headerRight}>
          <nav>
            {isLoggedIn ? (
              <button onClick={logout} className={`${styles.navButton} ${styles.logoutButton}`}>
                로그아웃
              </button>
            ) : (
              <Link to="/login" className={styles.navButton}>
                로그인
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;