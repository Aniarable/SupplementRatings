from django.db import migrations


DASHBOARD_USERS = ["ArihantGadgade", "Aniarable", "sixers"]


def add_dashboard_users(apps, schema_editor):
    User = apps.get_model("auth", "User")
    Group = apps.get_model("auth", "Group")
    try:
        group = Group.objects.get(name="Dashboard")
    except Group.DoesNotExist:
        return
    for username in DASHBOARD_USERS:
        try:
            user = User.objects.get(username=username)
            user.groups.add(group)
        except User.DoesNotExist:
            pass


def remove_dashboard_users(apps, schema_editor):
    User = apps.get_model("auth", "User")
    Group = apps.get_model("auth", "Group")
    try:
        group = Group.objects.get(name="Dashboard")
    except Group.DoesNotExist:
        return
    for username in DASHBOARD_USERS:
        try:
            user = User.objects.get(username=username)
            user.groups.remove(group)
        except User.DoesNotExist:
            pass


class Migration(migrations.Migration):
    dependencies = [
        ("pages", "0024_dashboard_group"),
    ]

    operations = [
        migrations.RunPython(add_dashboard_users, remove_dashboard_users),
    ]
