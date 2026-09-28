export default function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-container-highest bg-surface-container-lowest">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-headline-sm text-on-surface">DevLog</span>
          <span className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-label-sm text-text-muted">
            v1.0
          </span>
        </div>
        <p className="text-body-sm text-text-muted">
          © {new Date().getFullYear()} DevLog. Nền tảng chia sẻ kiến thức kỹ thuật &amp; công nghệ chuyên sâu.
        </p>
      </div>
    </footer>
  );
}
