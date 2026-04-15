import axios from "axios";
import { parseCookies } from "nookies";

const api = axios.create({
    baseURL: 'http://localhost:3333',
    withCredentials: true
});

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
  totalMinutes: number;
}

export interface DashboardStats {
  totalHours: number;
  totalMinutes: number;
  stardustData: StardustHobby[];
}

export interface CreateHobbyData {
  name: string;
  color: string;
}

export const hobbyService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/api/hobbies/stats');
    return response.data;
  },

  async create(data: CreateHobbyData) {
    const response = await api.post('/api/hobbies', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateHobbyData>) {
    const response = await api.put(`/api/hobbies/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/api/hobbies/${id}`);
  },

  async addSession(hobbyId: string, duration: number) {
    const response = await api.post('/api/hobbies/sessions', { hobbyId, duration });
    return response.data;
  }
};