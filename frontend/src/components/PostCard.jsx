import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";
import { Avatar, Icon, StatusBadge, TagList } from "./ui";

function Cover({ post, className }) {
  return (
    <div className={`relative overflow-hidden bg-code-surface ${className}`}>
      {post.image ? (
        <img
          src={post.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono text-4xl text-primary-fixed-dim/40">
          &lt;/&gt;
        </div>
      )}
      {post.category && (
        <span className="absolute top-3 left-3 rounded border border-white/10 bg-code-surface/85 px-2.5 py-0.5 font-mono text-label-sm text-white backdrop-blur-sm">
          {post.category.name}
        </span>
      )}
    </div>
  );
}

export default function PostCard({ post }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-all hover:border-primary-container/40 hover:shadow-md">
      <Link to={`/posts/${post.slug}`}>
        <Cover post={post} className="h-48" />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <TagList tags={post.tags} className="mb-2" />
          <h3 className="mb-2.5 line-clamp-2 font-display text-headline-sm font-bold text-on-surface transition-colors group-hover:text-primary-container">
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mb-4 line-clamp-3 text-body-sm text-on-surface-variant">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between border-t border-surface-container-highest pt-4">
          <div className="flex items-center gap-2.5">
            <Avatar name={post.author.username} size="h-7 w-7 text-[10px]" />
            <span className="text-body-sm font-medium text-on-surface">{post.author.username}</span>
          </div>
          {post.status === "draft" ? (
            <StatusBadge status="draft" />
          ) : (
            <span className="font-mono text-label-sm text-text-muted">{formatDate(post.published_at)}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeaturedPost({ post }) {
  return (
    <article className="card group grid overflow-hidden transition-all hover:shadow-md lg:grid-cols-2">
      <Link to={`/posts/${post.slug}`}>
        <Cover post={post} className="h-64 lg:h-full lg:min-h-80" />
      </Link>
      <div className="flex flex-col justify-between p-8">
        <div>
          {post.category && (
            <span className="mb-4 inline-block rounded bg-primary-fixed px-2.5 py-1 font-mono text-label-sm font-semibold text-primary">
              {post.category.name}
            </span>
          )}
          <h3 className="mb-4 font-display text-headline-lg leading-tight text-on-surface transition-colors group-hover:text-primary-container">
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mb-6 line-clamp-3 text-body-md text-on-surface-variant">{post.excerpt}</p>
          <TagList tags={post.tags} className="mb-6" />
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-surface-container-highest pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Avatar name={post.author.username} size="h-10 w-10 text-sm" />
            <div>
              <div className="text-body-sm font-bold text-on-surface">{post.author.username}</div>
              <div className="font-mono text-label-sm text-text-muted">{formatDate(post.published_at)}</div>
            </div>
          </div>
          <Link to={`/posts/${post.slug}`} className="btn-primary px-5 py-2.5">
            Đọc bài viết
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
