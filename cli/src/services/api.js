import axios from 'axios';
import { getToken } from './auth.js';

const baseURL = process.env.KRESH_API_URL || 'https://kresh.vercel.app';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

