import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// 1. Axios 인스턴스 생성
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // .env 파일 또는 기본값 사용
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

        // 401 에러이고, 아직 토큰 갱신 시도를 안했을 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                isRefreshing = false;
                // 로그아웃 처리 로직 (예: window.location.href = '/login';)
                return Promise.reject(error);
            }

            try {
                // 새로운 토큰을 요청합니다.
                const refreshResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/auth/refresh`, { refreshToken });
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
                
                // 새로 받은 토큰을 저장합니다.
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // 실패했던 원래 요청의 헤더를 새 토큰으로 변경합니다.
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                // 원래 요청을 다시 시도합니다.
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // 리프레시 토큰도 만료된 경우, 모든 토큰을 지우고 로그아웃 처리합니다.
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // 예: window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);


export default api;