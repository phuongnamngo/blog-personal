import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthShell from "../components/AuthShell";
import { FieldErrors, Icon } from "../components/ui";

const CODE = {
  file: "auth_session.ts",
  body: `interface DeveloperSession {
  author: "Engineer";
  hasAccess: boolean;
}

export async function verifyDev() {
  // Xác thực danh tính kỹ sư
  return await DevLog.auth.connect();
}`,
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      await login(form.username, form.password);
      navigate(location.state?.from ?? "/", { replace: true });
    } catch {
      setError("Sai tên đăng nhập hoặc mật khẩu.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      badge="devlog.io/stable"
      heading="Nâng tầm tri thức công nghệ."
      code={CODE}
      quote="Mỗi dòng code là một bước tiến trên hành trình làm chủ công nghệ."
    >
      <h1 className="font-display text-headline-lg text-on-surface">Chào mừng trở lại</h1>
      <p className="mt-2 mb-8 text-body-sm text-on-surface-variant">
        Đăng nhập để tiếp tục chia sẻ và quản lý bài viết của bạn.
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-body-sm font-semibold">Tên đăng nhập</label>
          <div className="relative">
            <Icon name="person" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              required
              placeholder="Nhập tên đăng nhập của bạn..."
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input pl-10"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-body-sm font-semibold">Mật khẩu</label>
          <div className="relative">
            <Icon name="lock" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" />
            <input
              required
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input pr-10 pl-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted hover:text-on-surface"
              aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <Icon name={showPw ? "visibility_off" : "visibility"} />
            </button>
          </div>
        </div>
        <FieldErrors messages={error} />
        <button disabled={pending} className="btn-primary w-full py-3 text-title-md">
          {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          <Icon name="login" className="text-[18px]" />
        </button>
      </form>

      <p className="mt-8 text-center text-body-sm text-on-surface-variant">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-semibold text-primary-container hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </AuthShell>
  );
}
