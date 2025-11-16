import axios from "axios";

const API = axios.create({
  baseURL: "https://sri-gayathri-backend.onrender.com/api",
  timeout: 10000,
});

// attach token automatically from localStorage for each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
