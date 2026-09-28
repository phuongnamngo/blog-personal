import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const qc = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("access"));

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    qc.clear(); // xoá cache, tránh còn bài nháp của user cũ
  }, [qc]);

  // khôi phục phiên khi tải lại trang
  useEffect(() => {
    if (!localStorage.getItem("access")) return;
    api
      .get("/auth/me/")
      .then((r) => setUser(r.data))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  // interceptor báo hết phiên
  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login/", { username, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    const me = await api.get("/auth/me/");
    setUser(me.data);
    qc.invalidateQueries(); // list phải tải lại để có bài nháp của mình
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
