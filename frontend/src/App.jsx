import { Route, Routes } from "react-router-dom";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import PostForm from "./pages/PostForm";

function App() {
  return (
    <Routes>
      {/* Login/Register tự dựng khung riêng (AuthShell) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/" element={<PostList />} />
        {/* /posts/new phải đứng trước /posts/:slug */}
        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:slug/edit"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:slug" element={<PostDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
