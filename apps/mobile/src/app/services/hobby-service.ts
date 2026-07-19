import axios from "axios";
import { parseCookies } from "nookies";
import { api } from "./api";

api.interceptors.request.use(config => {
  const cookies = parseCookies();
  const token = cookies['slowpace.token'];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

export interface StardustHobby {
  id: string;
  name: string;
  color: string;
  frequency: string;
  totalMinutes: number;
}

export interface DashboardStats {
  totalHours: number;
  totalMinutes: number;
  stardustData: StardustHobby[];
  isPaused: boolean;
  hasSeenTour: boolean;
}

export interface CreateHobbyData {
  name: string;
  color: string;
  frequency: string;
}

export interface SessionData {
  hobbyId: string;
  duration: number;
  content?: string;
  createdAt?: Date;
}

export interface Session {
  id: string;
  duration: number;
  content?: string;
  createdAt: string;
  hobby: {
    name: string;
    color: string;
  }
}

export const hobbyService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/hobbies/stats');
    return response.data;
  },

  async create(data: CreateHobbyData) {
    const response = await api.post('/hobbies', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateHobbyData>) {
    const response = await api.put(`/hobbies/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/hobbies/${id}`);
  },

  async addSession(data: SessionData) {
    const response = await api.post('/hobbies/sessions', data);
    return response.data;
  },

  async getHistory(): Promise<Session[]> {
    const response = await api.get('/hobbies/sessions/history');
    return response.data;
  },

  async togglePause(): Promise<{ isPaused: boolean }> {
    const response = await api.patch('/hobbies/settings/pause', {});
    return response.data;
  },

  async completeTour(): Promise<void> {
    await api.patch('/hobbies/settings/tour');
  }
};