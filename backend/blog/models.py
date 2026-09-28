from django.conf import settings
from django.db import models
from django.db.models import F
from django.urls import reverse
from django.utils import timezone
from django.utils.text import slugify
from unidecode import unidecode
from django.contrib.auth.models import User


def unique_slug(instance, source, max_length):
    """Sinh slug không dấu, tự thêm -2, -3... nếu bị trùng."""
    base = slugify(unidecode(source))[: max_length - 10] or "untitled"
    slug, n = base, 2
    qs = type(instance)._default_manager.exclude(pk=instance.pk)
    while qs.filter(slug=slug).exists():
        slug = f"{base}-{n}"
        n += 1
    return slug

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.CharField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.name, 100)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.CharField(max_length=100, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.name, 50)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PostQuerySet(models.QuerySet):
    def published(sefl):
        return sefl.filter(
            status=Post.Status.PUBLISHED, published_at__lte=timezone.now()
        )

    def with_relations(self):
        # Chống N+1: FK dùng select_related (JOIN), M2M dùng prefetch_related (query riêng)
        return self.select_related("author", "category").prefetch_related("tags")


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Bản nháp"
        PUBLISHED = "published", "Đã xuất bản"

    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blog_posts"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="post"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")
    content = models.TextField()
    image = models.ImageField(upload_to="posts/%Y/%m/", blank=True, null=True)
    status = models.CharField(max_length=10, choices=Status.choices, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    objects = PostQuerySet.as_manager()

    class Meta:
        ordering = [F("published_at").desc(nulls_last=True), "-created_at"]
        indexes = [models.Index(fields=["status", "-published_at"])]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.title, 255)
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("blog:post_detail", kwargs={"slug": self.slug})

    def __str__(self):
        return self.title
