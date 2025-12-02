import axios, { type AxiosInstance } from "axios";

// Se estiver usando Vite, use import.meta.env.
// Se for Create React App (CRA), use process.env.REACT_APP_API_URL
const baseURL: string = import.meta.env.VITE_API_URL || "https://oncomap-backend-pr8b.onrender.com";

const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;