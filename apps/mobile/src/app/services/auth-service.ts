import { setCookie, destroyCookie, parseCookies } from "nookies";
import axios from "axios";
import { AuthData } from "../lib/auth-schema";

const api = axios.create({
    baseURL: 'http://localhost:3333'
});

export const authService = {
    async signUp(data: AuthData) {
        const response = await api.post('/auth/signup', data);
        const { token } = response.data;

        setCookie(undefined, 'slowpace.token', token, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return response.data;
    },

    async login(data: AuthData) {
        const response = await api.post('/auth/login', data);
        const { token } = response.data;

        setCookie(undefined, 'slowpace.token', token, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return response.data;
    },

    logout() {
        destroyCookie(undefined, 'slowpace.token');
    }
}