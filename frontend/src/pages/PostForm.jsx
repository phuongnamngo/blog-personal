import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { FieldErrors, Icon, Spinner } from "../components/ui";

const STATUSES = [
  { value: "draft", label: "Bản nháp", icon: "edit_note" },
  { value: "published", label: "Xuất bản", icon: "public" },
];

function CoverPicker({ file, currentUrl, onChange }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : currentUrl), [file, currentUrl]);
  useEffect(() => () => file && URL.revokeObjectURL(preview), [file, preview]);

  return (
    <label className="group relative flex h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low transition-colors hover:border-primary-container/60">
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onChange(e.target.files[0] ?? null)}
      />
      {preview ? (
        <>
          <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="relative rounded-lg bg-code-surface/80 px-3 py-1.5 text-body-sm text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Đổi ảnh đại diện
          </span>
        </>
      ) : (
        <>
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest shadow-sm">
            <Icon name="add_photo_alternate" className="text-text-muted" />
          </span>
          <span className="font-display text-title-md text-on-surface">Thêm ảnh đại diện</span>
          <span className="mt-1 font-mono text-label-sm text-text-muted">Chọn ảnh từ máy tính (PNG, JPG, WebP)</span>
        </>
      )}
    </label>
  );
}

export default function PostForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories/").then((r) => r.data),
  });
  const tags = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags/").then((r) => r.data),
  });
  const existing = useQuery({
    queryKey: ["post", slug],
    queryFn: () => api.get(`/posts/${slug}/`).then((r) => r.data),
    enabled: isEdit,
  });

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
    status: "draft",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);

  // đổ dữ liệu cũ vào form khi sửa
  useEffect(() => {
    const p = existing.data;
    if (p)
      setForm({
        title: p.title,
        content: p.content,
        status: p.status,
        category: p.category?.slug ?? "",
        tags: p.tags.map((t) => t.slug),
      });
  }, [existing.data]);

  const save = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("status", form.status);
      fd.append("category", form.category); // "" → server hiểu là null
      form.tags.forEach((t) => fd.append("tags", t)); // lặp key cho many-to-many
      if (file) fd.append("image", file); // chỉ gửi khi chọn ảnh mới
      return isEdit ? api.put(`/posts/${slug}/`, fd) : api.post("/posts/", fd);
    },
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.setQueryData(["post", data.slug], data);
      navigate(`/posts/${data.slug}`);
    },
    onError: (e) => setErrors(e.response?.data ?? {}),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/posts/${slug}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  const toggleTag = (s) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(s) ? f.tags.filter((x) => x !== s) : [...f.tags, s],
    }));

  if (isEdit && existing.isPending) return <Spinner />;

  const submitLabel = isEdit ? "Cập nhật bài viết" : form.status === "published" ? "Xuất bản bài viết" : "Lưu bản nháp";

  return (
    <form
      className="mx-auto w-full max-w-4xl px-6 py-8"
      onSubmit={(e) => {
        e.preventDefault();
        setErrors({});
        save.mutate();
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container"
          aria-label="Quay lại"
        >
          <Icon name="arrow_back" />
        </button>
        <h1 className="font-display text-headline-md text-on-surface">{isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}</h1>
        {isEdit && (
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-label-sm ${
              existing.data.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {existing.data.status === "published" ? "Đang xuất bản" : "Bản nháp"}
          </span>
        )}
      </div>

      <div className="card space-y-8 p-6 md:p-10">
        <div>
          <CoverPicker file={file} currentUrl={existing.data?.image} onChange={setFile} />
          <FieldErrors messages={errors.image} />
        </div>

        <div>
          <input
            placeholder="Nhập tiêu đề bài viết của bạn…"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border-0 bg-transparent p-0 font-display text-[28px] leading-9 font-bold tracking-tight text-on-surface placeholder:text-outline-variant focus:ring-0 focus:outline-none md:text-headline-lg"
          />
          <FieldErrors messages={errors.title} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-body-sm font-semibold text-on-surface">Chuyên mục bài viết</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              <option value="">-- Không có chuyên mục --</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldErrors messages={errors.category} />
          </div>
          <div>
            <label className="mb-2 block text-body-sm font-semibold text-on-surface">Thẻ bài viết (Tags)</label>
            <div className="flex min-h-[46px] flex-wrap gap-2 rounded-lg border border-surface-container-highest bg-surface-container-lowest p-2">
              {tags.data?.length ? (
                tags.data.map((t) => {
                  const on = form.tags.includes(t.slug);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.slug)}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-label-sm transition-colors ${
                        on
                          ? "border-primary-container/30 bg-primary-fixed text-primary"
                          : "border-surface-container-highest text-text-muted hover:text-primary-container"
                      }`}
                    >
                      #{t.name}
                      {on && <Icon name="close" className="text-[14px]" />}
                    </button>
                  );
                })
              ) : (
                <span className="px-1 py-0.5 text-body-sm text-outline">Chưa có thẻ nào</span>
              )}
            </div>
            <FieldErrors messages={errors.tags} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-body-sm font-semibold text-on-surface">Nội dung</label>
          <textarea
            rows={18}
            placeholder="Bắt đầu viết nội dung bài viết…"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="input resize-y text-body-md leading-7"
          />
          <FieldErrors messages={errors.content} />
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-body-sm font-semibold text-on-surface">Chế độ phân phối bài viết</p>
            <p className="text-body-sm text-text-muted">Chọn trạng thái hiển thị của bài viết này trên trang chủ cộng đồng</p>
          </div>
          <div className="flex rounded-lg border border-surface-container-highest bg-surface-container p-1">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm({ ...form, status: s.value })}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-body-sm ${
                  form.status === s.value
                    ? "bg-surface-container-lowest font-semibold text-on-surface shadow-sm"
                    : "text-text-muted hover:text-on-surface"
                }`}
              >
                <Icon name={s.icon} className="text-[16px]" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-body-sm text-text-muted">
          <Icon name="info" className="text-[16px]" />
          Slug, ngày tạo và ngày cập nhật được hệ thống tạo tự động.
        </p>
        <FieldErrors messages={errors.non_field_errors ?? errors.detail} />
      </div>

      <div className="sticky bottom-4 z-40 mt-6 flex items-center justify-between rounded-xl border border-surface-container-highest bg-surface-container-lowest/95 p-3 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2">
          <Link to={isEdit ? `/posts/${slug}` : "/"} className="btn text-on-surface-variant hover:bg-surface-container-low">
            Hủy bỏ
          </Link>
          {isEdit && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="btn text-error hover:bg-error-container/40"
            >
              <Icon name="delete" className="text-[18px]" />
              Xóa bài viết
            </button>
          )}
        </div>
        <button disabled={save.isPending} className="btn-primary px-5 py-2.5">
          <Icon name={form.status === "published" ? "send" : "save"} className="text-[18px]" />
          {save.isPending ? "Đang lưu..." : submitLabel}
        </button>
      </div>

      {confirming && (
        <ConfirmDeleteModal
          title={form.title}
          pending={remove.isPending}
          onConfirm={() => remove.mutate()}
          onClose={() => setConfirming(false)}
        />
      )}
    </form>
  );
}
