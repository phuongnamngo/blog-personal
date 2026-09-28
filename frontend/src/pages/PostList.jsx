import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

export default function PostList() {
  const [params, setParams] = useSearchParams();
  const query = Object.fromEntries(params);
  const page = Number(query.page ?? 1);

  const posts = useQuery({
    queryKey: ["posts", query],
    queryFn: () => api.get("/posts/", { params: query }).then((r) => r.data),
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories/").then((r) => r.data),
  });

  const go = (changes) => setParams({ ...query, ...changes });

  if (posts.isPending) return <p>Đang tải...</p>;
  if (posts.isError) return <p>Có lỗi xảy ra.</p>;

  return (
    <main>
      <h1>Blog</h1>
      <nav>
        <button onClick={() => setParams({})}>Tất cả</button>
        {categories.data?.map((c) => (
          <button key={c.id} onClick={() => setParams({ category: c.slug })}>
            {c.name}
          </button>
        ))}
      </nav>

      {posts.data.results.map((p) => (
        <article key={p.id}>
          <h2>
            <Link to={`/posts/${p.slug}`}>{p.title}</Link>
          </h2>
          <p>
            {p.author.username} · {p.category?.name} ·{" "}
            {p.published_at?.slice(0, 10)}
          </p>
          <p>{p.excerpt}</p>
        </article>
      ))}

      <button
        disabled={!posts.data.previous}
        onClick={() => go({ page: page - 1 })}
      >
        « Trước
      </button>
      <span> Trang {page} </span>
      <button
        disabled={!posts.data.next}
        onClick={() => go({ page: page + 1 })}
      >
        Sau »
      </button>
    </main>
  );
}
