import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { AuthData } from "../lib/auth-schema";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333'
        : (process.env.NEXT_PUBLIC_API_URL || 'https://slowpace-web.onrender.com'),
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const cookies = parseCookies();
    const token = cookies['slowpace.token'];

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Sessão expirada. Limpando credenciais...");

            destroyCookie(null, 'slowpace.token', { path: '/' });

            if (typeof window !== "undefined") {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    async signUp(data: AuthData) {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    async login(data: AuthData) {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Erro ao invalidar sessão no servidor:", error);
        } finally {
            destroyCookie(null, 'slowpace.token', { path: '/' });
            window.location.href = '/login';
        }
    }
};

export { api };