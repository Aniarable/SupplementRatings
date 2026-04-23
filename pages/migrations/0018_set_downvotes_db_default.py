from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0017_add_downvotes_vote_type_title"),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE pages_rating ALTER COLUMN downvotes SET DEFAULT 0;",
            reverse_sql="ALTER TABLE pages_rating ALTER COLUMN downvotes DROP DEFAULT;",
        ),
        migrations.RunSQL(
            sql="ALTER TABLE pages_comment ALTER COLUMN downvotes SET DEFAULT 0;",
            reverse_sql="ALTER TABLE pages_comment ALTER COLUMN downvotes DROP DEFAULT;",
        ),
    ]
