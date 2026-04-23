from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0018_set_downvotes_db_default"),
    ]

    operations = [
        migrations.AddField(
            model_name="supplement",
            name="description",
            field=models.TextField(blank=True, default=""),
        ),
    ]
