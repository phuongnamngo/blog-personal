import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register/", form);
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data ?? {});  // DRF trả {field: ["msg", ...]}
    }
  };

  const field = (name, type = "text") => (
    <div>
      <input type={type} placeholder={name} value={form[name]}
             onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
      {errors[name]?.map((m) => <p key={m} style={{ color: "red" }}>{m}</p>)}
    </div>
  );

  return (
    <form onSubmit={submit}>
      <h1>Đăng ký</h1>
      {field("username")}
      {field("email", "email")}
      {field("password", "password")}
      <button>Tạo tài khoản</button>
    </form>
  );
}