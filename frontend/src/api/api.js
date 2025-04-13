import axios from 'axios';
import {useAuthStore} from "../store/authStore.js";

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

export default api;