import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("access") ||
    localStorage.getItem("orn_token");
  const userId = localStorage.getItem("userId");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId && !config.headers["x-user-id"]) {
    config.headers["x-user-id"] = userId;
  }
  return config;
});

export default api;