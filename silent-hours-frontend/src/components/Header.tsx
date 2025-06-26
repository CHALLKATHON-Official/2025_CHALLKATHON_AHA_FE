import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    Silent Hour
                </Link>
                <nav>
                    {isLoggedIn ? (
                        // 로그인 상태일 때
                        <button onClick={logout} className={styles.navButtonSecondary}>
                            로그아웃
                        </button>
                    ) : (
                        // 로그아웃 상태일 때
                        <>
                            <Link to="/login" className={styles.navButton}>
                                로그인
                            </Link>
                            <Link to="/signup" className={styles.navButtonSecondary}>
                                회원가입
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;