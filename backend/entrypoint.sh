#!/bin/bash
until python manage.py migrate; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

bash create_superuser.sh
python manage.py runserver 0.0.0.0:9000