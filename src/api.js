import axios from "axios";

const API = axios.create({
  baseURL: window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://sri-gayathri-backend.onrender.com/api",
  timeout: 30000,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token && config && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) window.location.href = "/login?expired=true";
    }
    return Promise.reject(error);
  }
);

export default API;
