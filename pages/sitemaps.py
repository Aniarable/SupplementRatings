# pages/sitemaps.py
from django.contrib.sitemaps import Sitemap
from .models import Supplement, Rating, Condition


class StaticSitemap(Sitemap):
    protocol = "https"
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return [
            ("/", 1.0),
            ("/feed", 0.9),
            ("/browse", 0.9),
            ("/top-rated", 0.8),
            ("/about", 0.5),
            ("/terms", 0.3),
            ("/privacy", 0.3),
        ]

    def location(self, item):
        return item[0]

    def priority(self, item):
        return item[1]


class SupplementSitemap(Sitemap):
    protocol = "https"
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Supplement.objects.all().order_by("id")

    def location(self, obj):
        return f"/supplements/{obj.id}"


class ReviewSitemap(Sitemap):
    protocol = "https"
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return Rating.objects.select_related("supplement").order_by("-updated_at")

    def location(self, obj):
        return f"/reviews/{obj.id}"

    def lastmod(self, obj):
        return obj.updated_at


class ConditionSitemap(Sitemap):
    protocol = "https"
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        # Only conditions that have at least one rating
        return (
            Condition.objects.filter(condition_ratings__isnull=False)
            .distinct()
            .order_by("name")
        )

    def location(self, obj):
        from urllib.parse import quote

        return f"/conditions/{quote(obj.name)}"
