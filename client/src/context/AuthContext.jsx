import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const storageKey = "pm_tool_auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const savedToken = parsed.token || "";
      setToken(savedToken);
      setUser(parsed.user || null);
      if (savedToken) {
        api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      }
    } catch (error) {
      localStorage.removeItem(storageKey);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(storageKey, JSON.stringify({ token, user }));
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem(storageKey);
    }
  }, [token, user]);

  const saveAuth = (payload) => {
    api.defaults.headers.common.Authorization = `Bearer ${payload.token}`;
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    delete api.defaults.headers.common.Authorization;
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, saveAuth, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
