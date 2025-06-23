import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const login = (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setIsLoggedIn(true);
        navigate('/'); // 로그인 후 메인 화면으로 이동
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/api/v1/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error("로그아웃 중 서버 오류 발생:", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsLoggedIn(false);
            navigate('/'); // ✅ 로그아웃 후에도 메인 화면으로 이동
        }
    };

    const value = { isLoggedIn, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};