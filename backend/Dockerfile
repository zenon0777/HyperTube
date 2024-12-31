FROM python:3.10-slim

# Set environment variables to prevent Python from writing .pyc files and enable output buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev python3-dev gcc ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pip and update it
RUN pip install --upgrade pip

# Copy requirements.txt into the container
COPY requirements.txt /app/

EXPOSE 8000

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/


CMD ["bash", "entrypoint.sh"]
