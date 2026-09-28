import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      navigate(location.state?.from ?? "/", { replace: true });
    } catch {
      setError("Sai tên đăng nhập hoặc mật khẩu.");
    }
  };

  return (
    <form onSubmit={submit}>
      <h1>Đăng nhập</h1>
      <input placeholder="Username" value={form.username}
             onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Mật khẩu" value={form.password}
             onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button>Đăng nhập</button>
    </form>
  );
}