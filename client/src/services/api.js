import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("pm_tool_auth");

  if (!stored) {
    return config;
  }

  try {
    const parsed = JSON.parse(stored);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  } catch (error) {
    localStorage.removeItem("pm_tool_auth");
  }

  return config;
});

export default api;
