import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FiMessageSquare, FiSearch, FiHome, FiClock, FiBookOpen, FiSettings, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  openCreateModal: () => void;
  openLoginModal: () => void; // ✨ 로그인 모달을 여는 함수를 props로 받습니다.
}

const Sidebar: React.FC<SidebarProps> = ({ openCreateModal, openLoginModal }) => {
  const { isLoggedIn } = useAuth();

  const handleCreatePostClick = () => {
    if (isLoggedIn) {
      openCreateModal();
    } else {
      // ✨ 로그인 되어 있지 않으면, window.confirm 대신 이 함수를 호출합니다.
      openLoginModal();
    }
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.logoContainer}>
        <FiMessageSquare size={28} />
        <h1>Silent Hours</h1>
      </div>

      <div className={styles.searchBar}>
        <FiSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search..." />
      </div>

      <div className={styles.createButtonContainer}>
        <button className={styles.createButton} onClick={handleCreatePostClick}>
          <FiPlus />
          <span>감정 기록하기</span>
        </button>
      </div>

      <nav className={styles.navMenu}>
        <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "activeLink" : "navLink"}><FiHome /><span>Home (Feed)</span></NavLink></li>
            <li><NavLink to="/timeline" className={({ isActive }) => isActive ? "activeLink" : "navLink"}><FiClock /><span>Timeline</span></NavLink></li>
            <li><NavLink to="/my-chronicle" className={({ isActive }) => isActive ? "activeLink" : "navLink"}><FiBookOpen /><span>My Chronicle</span></NavLink></li>
            <li><NavLink to="/settings" className={({ isActive }) => isActive ? "activeLink" : "navLink"}><FiSettings /><span>Settings</span></NavLink></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;