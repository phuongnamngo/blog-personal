import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import PostCard, { FeaturedPost } from "../components/PostCard";
import { EmptyState, Icon, Spinner } from "../components/ui";

const ORDERINGS = [
  { value: "", label: "Mới nhất" },
  { value: "published_at", label: "Cũ nhất" },
];

function Hero() {
  return (
    <section className="grid items-center gap-8 pt-4 pb-12 lg:grid-cols-12">
      <div className="flex flex-col items-start lg:col-span-7">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-container/20 bg-primary-fixed px-3 py-1 font-mono text-label-sm text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-container" />
          Chào mừng đến với DevLog
        </div>
        <h1 className="mb-5 font-display text-[36px] leading-[44px] font-extrabold tracking-tight text-on-surface md:text-display">
          Chia sẻ kiến thức.
          <br />
          <span className="text-primary-container">Ghi lại hành trình.</span>
        </h1>
        <p className="mb-8 max-w-xl text-body-lg text-on-surface-variant">
          Nơi chia sẻ những điều học được về lập trình, công nghệ và hành trình trở thành một Software
          Developer tốt hơn mỗi ngày.
        </p>
        <a href="#latest" className="btn-primary px-6 py-3 text-title-md">
          Khám phá bài viết
          <Icon name="arrow_forward" className="text-[18px]" />
        </a>
      </div>
      <div className="hidden w-full lg:col-span-5 lg:block">
        <div className="overflow-hidden rounded-xl border border-code-border bg-code-surface font-mono text-[13px] shadow-xl">
          <div className="flex items-center gap-2 border-b border-code-border bg-black/20 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-label-sm text-outline-variant">blog/views.py</span>
          </div>
          <pre className="overflow-x-auto p-5 leading-6 text-slate-300">
            <span className="text-pink-400">class</span> <span className="text-sky-400">PostViewSet</span>(viewsets.ModelViewSet):{"\n"}
            {"    "}lookup_field = <span className="text-emerald-400">"slug"</span>{"\n"}
            {"    "}search_fields = [<span className="text-emerald-400">"title"</span>, <span className="text-emerald-400">"content"</span>]{"\n\n"}
            {"    "}<span className="text-pink-400">def</span> <span className="text-blue-400">get_queryset</span>(self):{"\n"}
            {"        "}<span className="text-slate-500"># bài đã xuất bản + nháp của chính mình</span>{"\n"}
            {"        "}<span className="text-pink-400">return</span> Post.objects.published()
          </pre>
        </div>
      </div>
    </section>
  );
}

function CategoryChips({ categories, active, onSelect }) {
  const chip = (isActive) =>
    `rounded-lg border px-3.5 py-1.5 font-mono text-label-sm transition-colors ${
      isActive
        ? "border-primary-container bg-primary-fixed text-primary"
        : "border-surface-container-highest bg-surface-container-lowest text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container"
    }`;
  return (
    <section className="py-8">
      <h2 className="font-display text-headline-sm text-on-surface">Chủ đề nổi bật</h2>
      <p className="mb-5 text-body-sm text-text-muted">Lọc bài viết theo công nghệ và lĩnh vực bạn quan tâm</p>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" className={chip(!active)} onClick={() => onSelect(null)}>
          # Tất cả
        </button>
        {categories?.map((c) => (
          <button key={c.id} type="button" className={chip(active === c.slug)} onClick={() => onSelect(c.slug)}>
            # {c.name}
          </button>
        ))}
      </div>
    </section>
  );
}

function Pagination({ page, hasPrev, hasNext, onChange }) {
  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button type="button" className="btn-outline" disabled={!hasPrev} onClick={() => onChange(page - 1)}>
        <Icon name="chevron_left" className="text-[18px]" />
        Trước
      </button>
      <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary-container px-3 text-body-sm font-semibold text-on-primary">
        {page}
      </span>
      <button type="button" className="btn-outline" disabled={!hasNext} onClick={() => onChange(page + 1)}>
        Tiếp theo
        <Icon name="chevron_right" className="text-[18px]" />
      </button>
    </div>
  );
}

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

  const go = (changes) => {
    const next = { ...query, ...changes };
    Object.keys(next).forEach((k) => (next[k] == null || next[k] === "") && delete next[k]);
    setParams(next);
  };

  const isFiltered = Boolean(query.search || query.category || query.tag);
  const results = posts.data?.results ?? [];
  const showFeatured = !isFiltered && page === 1 && !query.ordering && results.length > 1;
  const [featured, ...rest] = results;
  const grid = showFeatured ? rest : results;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      {!isFiltered && page === 1 && <Hero />}

      <CategoryChips
        categories={categories.data}
        active={query.category}
        onSelect={(slug) => go({ category: slug, tag: null, page: null })}
      />

      {showFeatured && (
        <section className="py-8">
          <h2 className="mb-6 flex items-center gap-2 font-display text-headline-sm text-on-surface">
            <Icon name="star" className="text-primary-container" />
            Bài viết nổi bật
          </h2>
          <FeaturedPost post={featured} />
        </section>
      )}

      <section id="latest" className="scroll-mt-20 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-headline-sm text-on-surface">
              {query.search ? `Kết quả cho “${query.search}”` : "Bài viết mới nhất"}
            </h2>
            {query.tag && (
              <p className="mt-1 text-body-sm text-text-muted">
                Đang lọc theo thẻ <span className="font-mono text-primary-container">#{query.tag}</span> ·{" "}
                <Link to="/" className="underline hover:text-on-surface">
                  Bỏ lọc
                </Link>
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-surface-container p-1 text-body-sm">
            {ORDERINGS.map((o) => {
              const active = (query.ordering ?? "") === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => go({ ordering: o.value, page: null })}
                  className={`rounded px-3 py-1 ${
                    active
                      ? "bg-surface-container-lowest font-semibold text-primary-container shadow-sm"
                      : "text-text-muted hover:text-on-surface"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        {posts.isPending ? (
          <Spinner />
        ) : posts.isError ? (
          <EmptyState icon="error" title="Có lỗi xảy ra">
            Không tải được danh sách bài viết, vui lòng thử lại.
          </EmptyState>
        ) : results.length === 0 ? (
          <EmptyState title="Chưa có bài viết nào">Thử chọn chủ đề khác hoặc từ khóa khác.</EmptyState>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {grid.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <Pagination
              page={page}
              hasPrev={Boolean(posts.data.previous)}
              hasNext={Boolean(posts.data.next)}
              onChange={(p) => go({ page: p })}
            />
          </>
        )}
      </section>
    </main>
  );
}
