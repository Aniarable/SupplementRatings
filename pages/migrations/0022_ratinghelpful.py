from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0021_add_report_model"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="RatingHelpful",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "rating",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="helpful_marks",
                        to="pages.rating",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="helpful_marks",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {("user", "rating")},
            },
        ),
    ]
