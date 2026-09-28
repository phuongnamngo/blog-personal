import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    data: post,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => api.get(`/posts/${slug}/`).then((r) => r.data),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/posts/${slug}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  if (isPending) return <p>Đang tải...</p>;
  if (isError) return <p>Không tìm thấy bài viết.</p>;

  return (
    <article>
      <Link to="/">← Về trang chủ</Link>
      {user?.id === post.author.id && (
        <>
          <Link to={`/posts/${slug}/edit`}>Sửa</Link>
          <button onClick={() => confirm("Xoá bài này?") && remove.mutate()}>
            Xoá
          </button>
          {post.status === "draft" && <em> (Bản nháp)</em>}
        </>
      )}
      <h1>{post.title}</h1>
      <p>
        {post.author.username} · {post.category?.name}
      </p>
      {post.image && (
        <img src={post.image} alt="" style={{ maxWidth: "100%" }} />
      )}
      <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
    </article>
  );
}
