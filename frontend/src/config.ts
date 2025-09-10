// config.ts make the API_URL and STORAGE_URL configurable via environment variables
// and if uploaded to production, it will use the production URLs :)
export const BASE_URL = 
  import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
export const API_URL =
  import.meta.env.VITE_API_URL || `${BASE_URL}/api`;
export const STORAGE_URL =
  import.meta.env.VITE_STORAGE_URL || `${BASE_URL}/storage`;
