# blog/admin.py
from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Post, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "post_count")
    search_fields = ("name",)

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = "Số bài"


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("thumbnail", "title", "author", "category", "status_badge", "published_at")
    list_display_links = ("thumbnail", "title")
    list_filter = ("status", "category", "tags")
    list_select_related = ("author", "category")
    search_fields = ("title", "content")
    filter_horizontal = ("tags",)
    date_hierarchy = "published_at"
    readonly_fields = ("image_preview", "created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "slug", "author", "status")}),
        ("Nội dung", {"fields": ("content",)}),
        ("Phân loại", {"fields": ("category", "tags")}),
        ("Ảnh", {"fields": ("image", "image_preview")}),
        ("Thời gian", {"fields": ("published_at", "created_at", "updated_at")}),
    )
    actions = ["mark_published", "mark_draft"]

    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;" />', obj.image.url)
        return "—"
    thumbnail.short_description = ""

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width:300px;" />', obj.image.url)
        return "Chưa có ảnh"
    image_preview.short_description = "Xem trước"

    def status_badge(self, obj):
        color = "#16a34a" if obj.status == Post.Status.PUBLISHED else "#a16207"
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:10px;font-size:12px;">{}</span>',
            color, obj.get_status_display(),
        )
    status_badge.short_description = "Trạng thái"

    @admin.action(description="Đánh dấu Đã xuất bản")
    def mark_published(self, request, queryset):
        for post in queryset:  # để save() chạy, tự gán published_at
            post.status = Post.Status.PUBLISHED
            post.save()

    @admin.action(description="Đánh dấu Bản nháp")
    def mark_draft(self, request, queryset):
        queryset.update(status=Post.Status.DRAFT)