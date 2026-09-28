import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function PostDetail() {
  const { slug } = useParams();
  const {
    data: post,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => api.get(`/posts/${slug}/`).then((r) => r.data),
  });

  if (isPending) return <p>Đang tải...</p>;
  if (isError) return <p>Không tìm thấy bài viết.</p>;

  return (
    <article>
      <Link to="/">← Về trang chủ</Link>
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
