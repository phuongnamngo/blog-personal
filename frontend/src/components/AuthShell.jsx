import { Link } from "react-router-dom";
import Footer from "./Footer";
import { Icon, Logo } from "./ui";

export default function AuthShell({ badge, heading, code, quote, children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-surface-container-highest bg-surface-container-lowest">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Logo />
          <Link to="/" className="flex items-center gap-1.5 text-body-sm text-on-surface-variant hover:text-on-surface">
            <Icon name="arrow_back" className="text-[18px]" />
            Trang chủ
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="card grid w-full max-w-5xl overflow-hidden lg:grid-cols-[5fr_7fr]">
          <aside className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-code-surface p-8 text-white lg:flex">
            <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-primary-container/30 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-code-border bg-white/5 px-3 py-1 font-mono text-label-sm text-outline-variant">
                <span className="h-2 w-2 rounded-full bg-accent-success" />
                {badge}
              </span>
              <h2 className="mt-5 font-display text-headline-lg">{heading}</h2>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-code-border bg-black/30">
              <div className="flex items-center gap-2 border-b border-code-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-auto font-mono text-label-sm text-outline-variant">{code.file}</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-slate-200">{code.body}</pre>
            </div>
            <div className="relative border-t border-code-border pt-6">
              <p className="text-body-md italic text-slate-300">“{quote}”</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-code-border bg-primary-container/30 font-mono text-xs">
                  DL
                </span>
                <span className="text-body-sm font-semibold">Cộng đồng DevLog</span>
              </div>
            </div>
          </aside>

          <section className="flex items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
