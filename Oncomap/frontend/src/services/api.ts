import axios, { type AxiosInstance } from "axios";
const baseURL: string = import.meta.env.VITE_API_URL || "https://oncomap-backend-pr8b.onrender.com";

const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;