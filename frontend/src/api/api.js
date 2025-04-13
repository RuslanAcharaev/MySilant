import axios from 'axios';
import {useAuthStore} from "../store/authStore.js";
import {authService} from "../service/authService.js";

// export const API_URL = 'http://127.0.0.1:8000/api';
export const API_URL = 'http://176.108.253.166:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

let isRefreshing = false;
let requestQueue = [];
// let failedQueue = [];

const processQueue = (token = null) => {
    requestQueue.forEach(({config, resolve, reject}) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(api(config));
        } else {
            reject('Ошибка обновления токена');
        }
    });
    requestQueue = [];
};

const isTokenExpired = (expiresAt) => {
    if (!expiresAt) return true;
    return Date.now() >= expiresAt * 1000;
}

api.interceptors.request.use(
    async (config) => {
        const {
            token,
            tokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            refresh,
            logout,
            setShowLoginModal,
            setError,
        } = useAuthStore.getState();

        if (!token) return config;

        if (isTokenExpired(refreshTokenExpiresAt)) {
            logout();
            setError('Срок действия сессии истек');
            setShowLoginModal(true);
            throw new Error('Срок действия сессии истек');
        }

        if (isTokenExpired(tokenExpiresAt)) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    requestQueue.push({config, resolve, reject});
                });
            }

            isRefreshing = true;

            try {
                const success = await refresh(refreshToken);

                const newToken = useAuthStore.getState().token;
                config.headers.Authorization = `Bearer ${newToken}`;
                processQueue(newToken);

                return config;
            } catch (error) {
                processQueue(null);
                logout();
                setShowLoginModal(true);
                throw error;
            } finally {
                isRefreshing = false;
            }
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);
// const processQueue = (error, token = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });
//     failedQueue = [];
// }

// api.interceptors.request.use(
//     (config) => {
//         const token = useAuthStore.getState().token;
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
//
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({resolve, reject});
//                 }).then(token => {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     return api(originalRequest);
//                 }).catch(err => Promise.reject(err));
//             }
//
//             originalRequest._retry = true;
//             isRefreshing = true;
//
//             try {
//                 const refreshToken = useAuthStore.getState().refreshToken;
//                 const tokenExpiresAt = useAuthStore.getState().tokenExpiresAt;
//                 const refreshExpiresAt = useAuthStore.getState().refreshTokenExpiresAt;
//                 if (!refreshToken) {
//                     throw new Error('Отсутствует refresh token');
//                 }
//
//                 const response = await authService.refresh(refreshToken);
//                 const {access: newToken} = response;
//
//                 useAuthStore.getState().setToken(newToken, refreshToken, tokenExpiresAt, refreshExpiresAt);
//
//                 processQueue(null, newToken);
//
//                 originalRequest.headers.Authorization = `Bearer ${newToken}`;
//                 return api(originalRequest);
//
//             } catch (refreshError) {
//                 processQueue(refreshError, null);
//                 useAuthStore.getState().logout();
//                 useAuthStore.getState().setError('Срок авторизации истек');
//                 useAuthStore.getState().setShowLoginModal(true);
//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }
//
//         return Promise.reject(error);
//     }
// );

export default api;