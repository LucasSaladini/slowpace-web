import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { AuthData } from "../lib/auth-schema";
import { api } from "./api";

api.interceptors.request.use((config) => {
    const cookies = parseCookies();
    let token = cookies['slowpace.token'] as string | undefined;

    if (!token && typeof window !== "undefined") {
        token = localStorage.getItem('slowpace.token') || undefined;
    }

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

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token: string, password: string) {
        const response = await api.patch('/auth/reset-password', { token, password });
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