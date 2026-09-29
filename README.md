# DevLog

Blog cá nhân cho lập trình viên: đọc bài viết công khai, đăng ký tài khoản, và viết hoặc sửa bài của chính mình.

Giao diện React và Tailwind CSS nói chuyện với API Django qua JWT. PostgreSQL chạy bằng Docker Compose.

## Công nghệ

| Phần | Stack |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, TanStack Query, Axios |
| Backend | Django 5.2, Django REST Framework, SimpleJWT, django-filter, drf-spectacular |
| Cơ sở dữ liệu | PostgreSQL 16 |

## Cấu trúc

```
backend/          Django project (apps: accounts, blog)
frontend/         Ứng dụng React
docker-compose.yml
```

## Yêu cầu

- Docker và Docker Compose
- Python 3.10 trở lên
- Node.js 20 trở lên

## Chạy local

### 1. Cơ sở dữ liệu

Tạo file `.env` ở thư mục gốc của repo. Docker Compose đọc file này khi khởi động Postgres. Django dùng cùng các giá trị mặc định trong `backend/config/settings.py` nếu biến môi trường không được set.

```env
DB_NAME=blog_db
DB_USER=blog_personal
DB_PASSWORD=password@1234!
DB_HOST=localhost
DB_PORT=5432
DEBUG=True
```

Các giá trị trên chỉ dành cho máy local. Đổi mật khẩu trước khi dùng ở môi trường khác.

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # tùy chọn, để vào Django Admin
python manage.py runserver
```

API chạy tại `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173`. Vite proxy `/api` và `/media` sang backend cổng 8000.

## Tính năng

- Trang chủ: bài nổi bật, lọc theo danh mục và thẻ, tìm kiếm, sắp xếp, phân trang
- Chi tiết bài viết
- Đăng ký, đăng nhập, làm mới access token
- Viết, sửa, xóa bài của chính mình (nháp hoặc đã xuất bản, ảnh bìa, danh mục, thẻ)
- Khách chỉ thấy bài đã xuất bản. Người đăng nhập còn thấy bản nháp của mình

## Đường dẫn giao diện

| Đường dẫn | Màn hình |
| --- | --- |
| `/` | Danh sách bài viết |
| `/posts/:slug` | Chi tiết bài |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/posts/new` | Viết bài (cần đăng nhập) |
| `/posts/:slug/edit` | Sửa bài (chỉ tác giả) |

## API

Tài liệu OpenAPI: `http://localhost:8000/api/docs/`

| Phương thức | Đường dẫn | Ghi chú |
| --- | --- | --- |
| `POST` | `/api/auth/register/` | `username`, `email`, `password` |
| `POST` | `/api/auth/login/` | Trả `access` và `refresh` |
| `POST` | `/api/auth/refresh/` | Đổi refresh token lấy access token mới |
| `GET` | `/api/auth/me/` | Thông tin user hiện tại |
| `GET`, `POST` | `/api/posts/` | Danh sách và tạo bài. Tra cứu theo `slug` |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/posts/:slug/` | Đọc, sửa, xóa. Sửa và xóa chỉ tác giả |
| `GET` | `/api/categories/` | Danh mục |
| `GET` | `/api/tags/` | Thẻ |

Query trên danh sách bài: `search`, `category` (slug), `tag` (slug), `ordering` (`published_at` hoặc `-published_at`), `page`. Mỗi trang 6 bài.

Django Admin: `http://localhost:8000/admin/`

## Kiểm thử

```bash
cd backend
source .venv/bin/activate
python manage.py test
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```
