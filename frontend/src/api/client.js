import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.startsWith("/auth/");
    const refresh = localStorage.getItem("refresh");

    if (
      error.response?.status !== 401 ||
      original._retry ||
      isAuthCall ||
      !refresh
    ) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      refreshing ??= axios
        .post("/api/auth/refresh/", { refresh })
        .finally(() => {
          refreshing = null;
        });
      const { data } = await refreshing;
      localStorage.setItem("access", data.access);
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (e) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(e);
    }
  },
);
