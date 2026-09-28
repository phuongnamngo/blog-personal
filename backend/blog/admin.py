from django.contrib import admin
from .models import Post, Category, Tag

# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    search_fields = ("name",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "status", "published_at")
    list_filter = ("status", "category", "tags")
    list_select_related = ("author", "category")
    search_fields = ("title", "content")
    filter_horizontal = ("tags",)
    date_hierarchy = "published_at"
