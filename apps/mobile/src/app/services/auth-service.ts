import axios from "axios";
import { AuthData } from "../lib/auth-schema";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333'
        : (process.env.NEXT_PUBLIC_API_URL || 'https://slowpace-web.onrender.com'),
    withCredentials: true
});

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
            document.cookie = "slowpace.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = '/login';
        }
    }
}