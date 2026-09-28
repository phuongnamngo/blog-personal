import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import AuthShell from "../components/AuthShell";
import { FieldErrors, Icon } from "../components/ui";

const CODE = {
  file: "knowledge_graph.ts",
  body: `// Kiến thức bền vững thông qua chia sẻ
interface DeveloperKnowledge {
  shareRate: 100%;
  masteryLevel: 'EXPONENTIAL';
}`,
};

const FIELDS = [
  { name: "username", label: "Tên đăng nhập", placeholder: "vd: alexdev" },
  { name: "email", label: "Email", type: "email", placeholder: "ban@example.com" },
  { name: "password", label: "Mật khẩu", type: "password", placeholder: "••••••••" },
  { name: "confirm", label: "Nhập lại mật khẩu", type: "password", placeholder: "••••••••" },
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setErrors({ confirm: ["Mật khẩu không khớp."] });
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await api.post("/auth/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data ?? {});  // DRF trả {field: ["msg", ...]}
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      badge="Cộng đồng kỹ sư DevLog"
      heading="Đồng hành cùng hàng ngàn lập trình viên tài năng"
      code={CODE}
      quote="Chia sẻ là cách nhanh nhất để làm chủ kiến thức"
    >
      <h1 className="font-display text-headline-md text-on-surface">Tạo tài khoản</h1>
      <p className="mt-2 mb-8 text-body-sm text-on-surface-variant">
        Tham gia cộng đồng và bắt đầu chia sẻ kiến thức của bạn.
      </p>

      <form onSubmit={submit} className="space-y-5">
        {FIELDS.map(({ name, label, type = "text", placeholder }) => (
          <div key={name}>
            <label className="mb-2 block text-body-sm font-semibold">
              {label} <span className="text-error">*</span>
            </label>
            <input
              required
              type={type}
              placeholder={placeholder}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className={`input ${errors[name] ? "input-error" : ""}`}
            />
            <FieldErrors messages={errors[name]} />
          </div>
        ))}
        <FieldErrors messages={errors.non_field_errors} />
        <button disabled={pending} className="btn-primary w-full py-3 text-title-md">
          {pending ? "Đang tạo tài khoản..." : "Đăng ký"}
          <Icon name="arrow_forward" className="text-[18px]" />
        </button>
      </form>

      <p className="mt-8 text-center text-body-sm text-on-surface-variant">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-primary-container hover:underline">
          Đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
}
