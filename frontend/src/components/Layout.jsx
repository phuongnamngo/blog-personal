import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Footer from "./Footer";
import { Avatar, Icon, Logo } from "./ui";

const navClass = ({ isActive }) =>
  isActive
    ? "border-b-2 border-primary-container pb-1 font-semibold text-primary-container"
    : "pb-1 text-on-surface-variant transition-colors hover:text-on-surface";

function SearchBox() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("search") ?? "");

  return (
    <form
      className="relative hidden items-center sm:flex"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(q.trim() ? `/?search=${encodeURIComponent(q.trim())}` : "/");
      }}
    >
      <Icon name="search" className="pointer-events-none absolute left-3 text-outline" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm kiếm bài viết..."
        className="w-60 rounded-lg border border-surface-container-highest bg-surface-container-low py-1.5 pr-3 pl-9 text-body-sm placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none lg:w-72"
      />
    </form>
  );
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full border border-surface-container-highest p-0.5 pr-1.5 hover:bg-surface-container-low"
      >
        <Avatar name={user.username} />
        <Icon name="expand_more" className="text-[18px] text-text-muted" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg border border-surface-container-highest bg-surface-container-lowest py-1 shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="border-b border-surface-container-highest px-4 py-2 text-body-sm font-semibold">
            {user.username}
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-body-sm text-error hover:bg-surface-container-low"
          >
            <Icon name="logout" className="text-[18px]" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [params] = useSearchParams();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-surface-container-highest bg-surface-container-lowest/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 text-body-sm md:flex">
              <NavLink to="/" end className={navClass}>
                Trang chủ
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <SearchBox key={params.get("search") ?? ""} />
            <div className="hidden h-5 w-px bg-surface-container-highest sm:block" />
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/posts/new" className="btn-primary">
                  <Icon name="edit_square" className="text-[18px]" />
                  Viết bài
                </Link>
                <UserMenu user={user} onLogout={logout} />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-2 py-1 text-body-sm font-medium text-on-surface-variant hover:text-on-surface">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
