import React from 'react';
import Sidebar from '../components/Sidebar';
// 이 경로는 같은 폴더(src/layouts)에 있는 css 파일을 가리켜야 합니다.
import styles from './MainLayout.module.css'; 

interface MainLayoutProps {
  children: React.ReactNode;
  openCreateModal: () => void;
  openLoginModal: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, openCreateModal, openLoginModal }) => {
  return (
    <div className={styles.mainLayoutWrapper}>
      <Sidebar openCreateModal={openCreateModal} openLoginModal={openLoginModal} />
      <div className={styles.contentArea}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;