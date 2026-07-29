import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const cookies = parseCookies();
        const token = cookies['slowpace.token'];

        const isLoginOrAuthRoute = 
            config.url?.includes('/auth/login') || 
            config.url?.includes('/auth/signup');

        if (token && !isLoginOrAuthRoute) {
            const parts = token.split('.');
            const isJwtValid = parts.length === 3 && parts[0].length > 0 && parts[1].length > 0 && parts[2].length > 0;

            if (!isJwtValid) {
                console.warn("Token inválido/corrompido detectado no client. Limpando...");
                destroyCookie(null, 'slowpace.token', { path: '/' });
                
                if (typeof document !== 'undefined') {
                    document.cookie = 'slowpace.token=; Max-Age=0; path=/;';
                }

                if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
                    window.location.replace('/login');
                }

                return Promise.reject(new Error('Token inválido barrado no cliente'));
            }

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRedirecting = false;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
        const isLoginOrAuthRoute = 
            originalRequest?.url?.includes('/auth/login') || 
            originalRequest?.url?.includes('/auth/signup');

        if (error.response && error.response.status === 401 && !isLoginOrAuthRoute) {
            if (!isRedirecting && typeof window !== 'undefined') {
                isRedirecting = true;
                destroyCookie(null, 'slowpace.token', { path: '/' });
                document.cookie = 'slowpace.token=; Max-Age=0; path=/;';
                
                if (!window.location.pathname.includes('/login')) {
                    window.location.replace('/login');
                }
            }
        }

        return Promise.reject(error);
    }
);