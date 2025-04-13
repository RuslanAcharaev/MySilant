import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {authService} from "../service/authService.js";
import {useInfoStore} from "./infoStore.js";

const initialState = {
    token: null,
    tokenExpiresAt: null,
    refreshToken: null,
    refreshTokenExpiresAt: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    username: null,
    role: null,
    fullname: null,
    showLoginModal: false,
};

const useAuthStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            setToken: (token, refreshToken, tokenExpiresAt, refreshTokenExpiresAt) => {
                set({
                    token,
                    tokenExpiresAt,
                    refreshToken,
                    refreshTokenExpiresAt,
                    isAuthenticated: true,
                    error: null,
                });
            },
            setRefresh: (token, tokenExpiresAt) => {
                set({
                    token,
                    tokenExpiresAt,
                })
            },
            setUser: (username, role, fullname) => {
                set({
                    username,
                    role,
                    fullname
                })
            },
            setError: (error) => set({error}),
            setLoading: (isLoading) => set({isLoading}),
            setShowLoginModal: (showLoginModal) => set({showLoginModal}),

            login: async (login, password) => {
                const {setLoading, setToken, setError, setUser} = get();

                try {
                    // console.log('0.1 Начало авторизации')
                    setLoading(true);
                    setError(null);

                    const response = await authService.login({
                        "username": login, "password": password
                    });
                    setToken(response.access, response.refresh, response.access_expires_at, response.refresh_expires_at);
                    setUser(response.user.username, response.user.role, response.user.fullname);
                    // console.log('0.2 Авторизация пройдена: ', {
                    //     token: response.access,
                    //     refresh: response.refresh,
                    //     username: response.user.username,
                    //     role: response.user.role,
                    //     fullname: response.user.fullname,
                    //     token_expires: response.access_expires_at,
                    //     refresh_expires: response.refresh_expires_at,
                    // })
                } catch (error) {
                    setError(error.message);
                    return {
                        success: false,
                        error: error.message,
                    };
                } finally {
                    setLoading(false);
                }

                return true;
            },

            refresh: async (refreshToken) => {
                const {setRefresh, setError} = get();

                try {
                    // console.log('9.1 Начало обновления токена. Текущий refreshToken:', refreshToken);
                    setError(null);

                    const response = await authService.refresh(refreshToken);
                    setRefresh(response.access, response.access_expires_at);
                    // console.log('9.2 Обновление прошло успешно:', {
                    //     'Токен: ': response.access,
                    //     'Истекает: ': new Date(response.access_expires_at * 1000),
                    // })
                } catch (error) {
                    setError(error.message);
                    return false;
                }

                return true;
            },

            logout: () => {
                useInfoStore.getState().clearInfoStore();
                set(initialState);
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                tokenExpiresAt: state.tokenExpiresAt,
                refreshTokenExpiresAt: state.refreshTokenExpiresAt,
                isAuthenticated: state.isAuthenticated,
                role: state.role,
                fullname: state.fullname,
            })
        }
    )
);

export {useAuthStore};