import { createFocusSchema } from "@/lib/focus-schema";
import { api } from "./api";

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
        const response = await api.get('/focus');
        return response.data;
    },

    async create(title: string): Promise<FocusTask> {
        const validated = createFocusSchema.parse({ title });

        const response = await api.post('/focus', { title: validated.title });
        return response.data;
    },

    async update(id: string, data: Partial<FocusTask>): Promise<FocusTask> {
        const response = await api.put(`/focus/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/focus/${id}`);
    }
};