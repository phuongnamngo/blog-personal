import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PostCard from "../components/PostCard";
import { Avatar, EmptyState, Icon, Spinner, StatusBadge, TagList } from "../components/ui";
import { formatDate } from "../utils/format";

function RelatedPosts({ post }) {
  const category = post.category?.slug;
  const { data } = useQuery({
    queryKey: ["posts", { category }],
    queryFn: () => api.get("/posts/", { params: { category } }).then((r) => r.data),
    enabled: Boolean(category),
  });
  const related = data?.results.filter((p) => p.id !== post.id).slice(0, 3);
  if (!related?.length) return null;
  return (
    <section className="mt-16 border-t border-surface-container-highest pt-10">
      <h2 className="mb-6 font-display text-headline-sm text-on-surface">Bài viết liên quan</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);

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

  if (isPending) return <Spinner />;
  if (isError)
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState icon="search_off" title="Không tìm thấy bài viết">
          <Link to="/" className="text-primary-container hover:underline">
            ← Về trang chủ
          </Link>
        </EmptyState>
      </main>
    );

  const isOwner = user?.id === post.author.id;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-body-sm text-text-muted">
        <Link to="/" className="hover:text-on-surface">
          Trang chủ
        </Link>
        {post.category && (
          <>
            <Icon name="chevron_right" className="text-[16px]" />
            <Link to={`/?category=${post.category.slug}`} className="hover:text-on-surface">
              {post.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {post.category && (
                <span className="rounded bg-primary-fixed px-2.5 py-1 font-mono text-label-sm font-semibold text-primary">
                  {post.category.name}
                </span>
              )}
              {post.status === "draft" && <StatusBadge status="draft" />}
            </div>
            <h1 className="font-display text-[28px] leading-9 font-bold tracking-tight text-on-surface md:text-headline-lg">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <Avatar name={post.author.username} size="h-10 w-10 text-sm" />
              <div>
                <div className="text-body-sm font-bold text-on-surface">{post.author.username}</div>
                <div className="font-mono text-label-sm text-text-muted">
                  {post.published_at ? formatDate(post.published_at) : "Chưa xuất bản"}
                </div>
              </div>
            </div>
          </header>

          {post.image && (
            <img
              src={post.image}
              alt=""
              className="mb-8 w-full rounded-xl border border-surface-container-highest object-cover"
            />
          )}

          <div className="card p-6 md:p-10">
            <div className="max-w-[720px] text-body-lg whitespace-pre-wrap text-on-surface">{post.content}</div>
            {post.tags.length > 0 && (
              <div className="mt-10 border-t border-surface-container-highest pt-6">
                <TagList tags={post.tags} className="text-body-sm" />
              </div>
            )}
          </div>
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="card p-6">
              <p className="mb-4 font-mono text-label-sm uppercase text-text-muted">Tác giả</p>
              <div className="flex items-center gap-3">
                <Avatar name={post.author.username} size="h-12 w-12 text-base" />
                <span className="font-display text-headline-sm text-on-surface">{post.author.username}</span>
              </div>
              <dl className="mt-6 space-y-2 border-t border-surface-container-highest pt-4 text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Tạo lúc</dt>
                  <dd className="font-medium">{formatDate(post.created_at)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Cập nhật</dt>
                  <dd className="font-medium">{formatDate(post.updated_at)}</dd>
                </div>
              </dl>
            </div>

            {isOwner && (
              <div className="card space-y-3 p-6">
                <p className="font-mono text-label-sm uppercase text-text-muted">Quản lý bài viết</p>
                <Link to={`/posts/${slug}/edit`} className="btn-outline w-full">
                  <Icon name="edit" className="text-[18px]" />
                  Chỉnh sửa
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="btn w-full border border-error/30 text-error hover:bg-error-container/40"
                >
                  <Icon name="delete" className="text-[18px]" />
                  Xóa bài viết
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      <RelatedPosts post={post} />

      {confirming && (
        <ConfirmDeleteModal
          title={post.title}
          pending={remove.isPending}
          onConfirm={() => remove.mutate()}
          onClose={() => setConfirming(false)}
        />
      )}
    </main>
  );
}
