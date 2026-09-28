from django.db.models import Q
from django.utils import timezone
from django_filters import rest_framework as filters
from rest_framework import permissions, viewsets

from .models import Category, Post, Tag
from .serializers import (CategorySerializer, PostDetailSerializer,
                          PostListSerializer, PostWriteSerializer, TagSerializer)


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS or obj.author_id == request.user.id


class PostFilter(filters.FilterSet):
    category = filters.CharFilter(field_name="category__slug")
    tag = filters.CharFilter(field_name="tags__slug", distinct=True)

    class Meta:
        model = Post
        fields = ["category", "tag"]


class PostViewSet(viewsets.ModelViewSet):
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filterset_class = PostFilter
    search_fields = ["title", "content"]
    ordering_fields = ["published_at", "created_at"]

    def get_queryset(self):
        qs = Post.objects.with_relations()
        user = self.request.user
        if user.is_authenticated:
            # người dùng thấy bài đã xuất bản + bài (kể cả nháp) của chính mình
            return qs.filter(
                Q(status=Post.Status.PUBLISHED, published_at__lte=timezone.now())
                | Q(author=user)
            )
        return qs.published()

    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer
        if self.action in ("create", "update", "partial_update"):
            return PostWriteSerializer
        return PostDetailSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = "slug"
    pagination_class = None