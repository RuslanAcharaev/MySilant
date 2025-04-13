import api, {API_URL} from '../api/api.js';
import axios from "axios";

const refreshApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

export const authService = {

    async login(credentials) {
        try {
            const response = await api.post('/token/', credentials);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка авторизации');
        }
    },

    async refresh(refreshToken) {
        try {
            const response = await refreshApi.post(`/token/refresh/`, {
                refresh: refreshToken
            });
            // console.log(response)
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка обновления токена');
        }
    }

};
