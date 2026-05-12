from django.db import migrations


def create_dashboard_group(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Group.objects.get_or_create(name="Dashboard")


def delete_dashboard_group(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Group.objects.filter(name="Dashboard").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0023_pageview"),
    ]

    operations = [
        migrations.RunPython(create_dashboard_group, delete_dashboard_group),
    ]
