import { Link } from "react-router-dom";

export function Icon({ name, className = "" }) {
  return (
    <span className={`icon ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container font-mono text-sm font-bold text-on-primary shadow-sm">
        &lt;/&gt;
      </span>
      <span className="font-display text-headline-md tracking-tight text-on-surface">
        DevLog
      </span>
    </Link>
  );
}

export function Avatar({ name, size = "h-8 w-8 text-xs" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary-fixed font-mono font-semibold uppercase text-primary ${size}`}
    >
      {name?.slice(0, 2)}
    </span>
  );
}

export function TagList({ tags, className = "" }) {
  if (!tags?.length) return null;
  return (
    <div className={`flex flex-wrap gap-x-2 gap-y-1 font-mono text-label-sm text-text-muted ${className}`}>
      {tags.map((t) => (
        <Link key={t.id} to={`/?tag=${t.slug}`} className="hover:text-primary-container">
          #{t.name}
        </Link>
      ))}
    </div>
  );
}

export function StatusBadge({ status }) {
  return status === "draft" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-label-sm font-semibold text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Bản nháp
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-label-sm font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-success" />
      Đã xuất bản
    </span>
  );
}

export function FieldErrors({ messages }) {
  if (!messages) return null;
  const list = Array.isArray(messages) ? messages : [messages];
  return list.map((m) => (
    <p key={m} className="mt-1.5 flex items-center gap-1 text-body-sm text-error">
      <Icon name="error" className="text-[16px]" />
      {m}
    </p>
  ));
}

export function Spinner({ label = "Đang tải..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-body-sm text-text-muted">
      <Icon name="progress_activity" className="animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ icon = "article", title, children }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <Icon name={icon} className="mb-3 text-[40px] text-outline-variant" />
      <p className="font-display text-headline-sm text-on-surface">{title}</p>
      {children && <div className="mt-2 text-body-sm text-text-muted">{children}</div>}
    </div>
  );
}