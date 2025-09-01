// config.ts make the API_URL and STORAGE_URL configurable via environment variables
// and if uploaded to production, it will use the production URLs :)
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const STORAGE_URL =
  import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage';
