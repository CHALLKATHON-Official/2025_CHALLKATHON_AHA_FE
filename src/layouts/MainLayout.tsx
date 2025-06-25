import React from "react";
import Sidebar from "../components/Sidebar";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  onSidebarClose: () => void;
  openCreateModal: () => void;
  openLoginModal: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isSidebarOpen,
  onSidebarClose,
  openCreateModal,
  openLoginModal,
}) => {
  return (
    <div className={styles.mainLayoutWrapper}>
      {/* ✨ 사이드바 닫기 오버레이 */}
      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={onSidebarClose} />
      )}

      {/* ✨ isSidebarOpen 상태에 따라 클래스 동적 할당 */}
      <div
        className={`${styles.sidebarWrapper} ${
          isSidebarOpen ? styles.open : ""
        }`}
      >
        <Sidebar
          openCreateModal={openCreateModal}
          openLoginModal={openLoginModal}
        />
      </div>

      <div className={styles.contentArea}>{children}</div>
    </div>
  );
};

export default MainLayout;
