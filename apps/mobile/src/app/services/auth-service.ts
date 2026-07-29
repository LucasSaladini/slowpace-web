import { destroyCookie } from "nookies";
import { AuthData } from "../lib/auth-schema";
import { api } from "./api";

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

    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        const response = await api.patch('/auth/change-password', { currentPassword, newPassword, confirmPassword });
        return response.data;
    },

    async deleteAccount(email: string) {
        const response = await api.delete('/auth/delete-account', { 
            data: { email }
        });
        return response.data;
    },

    async getProfile() {
        const response = await api.get('/auth/get-user');
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