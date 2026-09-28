from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Post, Tag

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class PostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "image",
            "author",
            "category",
            "tags",
            "status",
            "published_at",
        ]

    def get_excerpt(self, obj):
        return obj.content[:200]


class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + [
            "content",
            "created_at",
            "updated_at",
        ]


class PostWriteSerializer(serializers.ModelSerializer):
    # Client gửi slug (chuỗi) thay vì object lồng nhau
    category = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
    )
    tags = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Tag.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = Post
        fields = ["title", "content", "image", "category", "tags", "status"]

    def to_representation(self, instance):
        # Ghi bằng format này, nhưng trả về bằng format detail
        return PostDetailSerializer(instance, context=self.context).data
