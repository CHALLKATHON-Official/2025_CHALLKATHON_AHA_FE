import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  FiHome,
  FiClock,
  FiBookOpen,
  FiUser,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  openCreateModal: () => void;
  openLoginModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  openCreateModal,
  openLoginModal,
}) => {
  const { isLoggedIn } = useAuth();

  const handleCreatePostClick = () => {
    if (isLoggedIn) {
      openCreateModal();
    } else {
      openLoginModal();
    }
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.logoContainer}>
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
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FiHome size={18} />
              <span>Home (Feed)</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/timeline"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FiClock size={18} />
              <span>Timeline</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-chronicle"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FiBookOpen size={18} />
              <span>My Chronicle</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FiUser size={18} />
              <span>My Page</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
