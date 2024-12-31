#!/bin/bash

# Set default values
USERNAME="admin"
EMAIL="admin@example.com"
PASSWORD="addmin1337"

# Allow optional arguments for username, email, and password
while getopts u:e:p: flag
do
    case "${flag}" in
        u) USERNAME=${OPTARG};;
        e) EMAIL=${OPTARG};;
        p) PASSWORD=${OPTARG};;
    esac
done

# Check if manage.py exists in the current directory
if [ ! -f manage.py ]; then
    echo "Error: manage.py not found. Please run this script from the root of your Django project."
    exit 1
fi

# Run Django shell command to create superuser
echo "Creating superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model

User = get_user_model()
if not User.objects.filter(username="$USERNAME").exists():
    User.objects.create_superuser(username="$USERNAME", email="$EMAIL", password="$PASSWORD")
    print("Superuser created: username=$USERNAME, email=$EMAIL")
else:
    print("Superuser with username '$USERNAME' already exists.")
END
