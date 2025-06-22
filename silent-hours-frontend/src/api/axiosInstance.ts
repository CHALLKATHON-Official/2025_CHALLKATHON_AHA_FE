import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// 1. Axios 인스턴스 생성
const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. 요청 인터셉터 (Request Interceptor)
//    모든 API 요청을 보내기 전에 실행됩니다.
api.interceptors.request.use(
    (config) => {
        // localStorage에서 accessToken을 가져옵니다.
        const accessToken = localStorage.getItem('accessToken');

        // 토큰이 있다면, 헤더에 'Authorization' 필드를 추가합니다.
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 응답 인터셉터 (Response Interceptor)
//    API 응답을 받은 후 실행됩니다. 401 에러(인증 실패) 시 토큰 갱신 시도.
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; config: AxiosRequestConfig<any>; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // ... (isRefreshing 관련 로직 동일) ...
            
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                isRefreshing = false;
                // ... 로그아웃 처리 ...
                return Promise.reject(error);
            }

            try {
                // 새로운 토큰을 요청하는 URL을 상대 경로로 수정합니다.
                const refreshResponse = await axios.post('/api/v1/auth/refresh', { refreshToken });
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
                
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                return api(originalRequest);
            } catch (refreshError) {
                // ... (기존 에러 처리 로직 동일) ...
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;