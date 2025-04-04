import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// add token to requests
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export default api;
