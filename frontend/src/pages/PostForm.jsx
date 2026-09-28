import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

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

  const toggleTag = (s) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(s) ? f.tags.filter((x) => x !== s) : [...f.tags, s],
    }));

  const err = (name) =>
    errors[name]?.map((m) => (
      <p key={m} style={{ color: "red" }}>
        {m}
      </p>
    ));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setErrors({});
        save.mutate();
      }}
    >
      <h1>{isEdit ? "Sửa bài" : "Viết bài mới"}</h1>

      <input
        placeholder="Tiêu đề"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      {err("title")}

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">-- Không có danh mục --</option>
        {categories.data?.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <div>
        {tags.data?.map((t) => (
          <label key={t.id}>
            <input
              type="checkbox"
              checked={form.tags.includes(t.slug)}
              onChange={() => toggleTag(t.slug)}
            />
            {t.name}
          </label>
        ))}
      </div>

      <textarea
        rows={12}
        placeholder="Nội dung"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      {err("content")}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0] ?? null)}
      />
      {err("image")}

      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="draft">Bản nháp</option>
        <option value="published">Xuất bản</option>
      </select>

      <button disabled={save.isPending}>
        {save.isPending ? "Đang lưu..." : "Lưu"}
      </button>
    </form>
  );
}
