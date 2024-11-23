# Django App with Conda Environment

This is a Django application that uses Conda to manage dependencies and the Python environment.

## Features

- Built using Django, a high-level Python web framework.
- Dependencies are managed using Conda for reproducible environments.
- Easily customizable and extendable.

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) (Anaconda or Miniconda)
2. Python 3.8+ (managed via Conda)
3. Git (for version control)

---

## Setup Instructions

Follow these steps to set up the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/zenon0777/HyperTube.git
cd HyperTube/backend
```

### 2. Create environment

```bash
conda env create -f environment.yml
conda activate hyper
```


### 3. Run Migrations

```bash
python manage.py migrate
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

## Install packages

```bash
conda install "package-name"
conda env create -f environment.yml
```