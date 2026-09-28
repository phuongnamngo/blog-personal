import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <header style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Blog</Link>
        <span style={{ flex: 1 }} />
        {user ? (
          <>
            <Link to="/posts/new">Viết bài</Link>
            <span>{user.username}</span>
            <button onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </header>
      <Outlet />
    </>
  );
}
