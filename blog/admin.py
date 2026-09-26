from django.contrib import admin
from .models import Post,Category
# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    search_fields = ("name", )
    
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display=(
        "id",
        "title",
        "author",
        "category",
        "status",
        "created_at",
    )
    
    list_filter=("status", "category", "created_at")
    
    search_fields=("title", "content")
    
    prepopulated_fields={"slug": ("title",)}