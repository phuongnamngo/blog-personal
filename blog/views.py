from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, ListView

from .models import Category, Post


class PostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"

    def get_queryset(self):
        return (
            Post.objects
            .filter(status="published")
            .select_related("author", "category")
        )


class CategoryPostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"

    def get_queryset(self):
        self.category = get_object_or_404(
            Category,
            slug=self.kwargs["slug"],
        )

        return (
            Post.objects
            .filter(
                category=self.category,
                status="published",
            )
            .select_related("author", "category")
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["category"] = self.category

        return context

class PostDetailView(DetailView):
    model = Post
    template_name = "blog/post_detail.html"
    context_object_name = "post"

    def get_queryset(self):
        return (
            Post.objects
            .filter(status="published")
            .select_related("author", "category")
        )