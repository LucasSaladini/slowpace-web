import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

const finalBaseURL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;

export const api = axios.create({
    baseURL: finalBaseURL,
    withCredentials: true,
});