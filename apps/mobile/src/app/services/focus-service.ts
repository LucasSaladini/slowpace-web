import { createFocusSchema } from "@/lib/focus-schema";
import axios from "axios";
import { parseCookies } from "nookies";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333'
        : (process.env.NEXT_PUBLIC_API_URL || 'https://slowpace-api-tunnel.loca.lt'),
    withCredentials: true,
    headers: {
        'bypass-tunnel-reminder': 'true',
    }
});

api.interceptors.request.use(config => {
    const cookies = parseCookies();
    const token = cookies['slowpace.token'];

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export interface FocusTask {
    id: string;
    title: string;
    isCompleted: boolean;
    isBacklog: boolean;
    createdAt: string;
    updatedAt: string;
}

export const focusService = {
    async getAll(): Promise<FocusTask[]> {
        const response = await api.get('/api/focus');
        return response.data;
    },

    async create(title: string): Promise<FocusTask> {
        const validated = createFocusSchema.parse({ title });

        const response = await api.post('/api/focus', { title: validated.title });
        return response.data;
    },

    async update(id: string, data: Partial<FocusTask>): Promise<FocusTask> {
        const response = await api.put(`/api/focus/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/api/focus/${id}`);
    }
};