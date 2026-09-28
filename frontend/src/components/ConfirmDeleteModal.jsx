import { useEffect } from "react";
import { Icon } from "./ui";

export default function ConfirmDeleteModal({ title, pending, onConfirm, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-code-surface/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-xl border border-surface-container-highest bg-surface-container-lowest p-6 text-center shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded p-1 text-text-muted hover:bg-surface-container-low"
          aria-label="Đóng"
        >
          <Icon name="close" />
        </button>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
          <Icon name="warning" />
        </div>
        <h2 className="font-display text-headline-sm text-on-surface">Xóa bài viết?</h2>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          Bài viết sau khi xóa sẽ không thể khôi phục. Bạn có chắc chắn muốn tiếp tục?
        </p>
        <div className="mt-5 rounded-lg border border-surface-container-highest bg-surface-container-low p-3 text-left">
          <p className="font-mono text-label-sm uppercase text-text-muted">Bài viết được chọn:</p>
          <p className="mt-1 text-body-sm font-semibold text-on-surface">{title}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="btn-outline py-2.5">
            Hủy
          </button>
          <button type="button" onClick={onConfirm} disabled={pending} className="btn-danger py-2.5">
            <Icon name="delete" className="text-[18px]" />
            {pending ? "Đang xóa..." : "Xóa bài viết"}
          </button>
        </div>
      </div>
    </div>
  );
}
