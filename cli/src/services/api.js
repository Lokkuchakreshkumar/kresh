import axios from 'axios';

const baseURL = process.env.KRESH_API_URL || 'https://kresh.vercel.app';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
