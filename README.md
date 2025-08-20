# HyperTube - Modern Movie Streaming Platform

![HyperTube Logo](/HyperTubeFront/public/logo.svg)

A full-stack movie streaming platform that allows users to browse, search, and stream movies with a modern, responsive interface, with built-in torrent client.


## 🚀 Features

- **Movie Streaming**: Stream movies from torrent directly in your browser
- **Rich Catalog**: Browse movies by genres, popularity, and release year
- **Search**: Find movies across multiple sources
- **User Accounts**: Secure authentication and user profiles
- **Watchlist**: Save and organize your favorite movies
- **Comments & Ratings**: Share your thoughts on movies
- **Multi-language**: Supports multiple languages
- **Responsive Design**: Works on all devices

## 🛠 Technologies

### Frontend
- Next.js 15
- TypeScript
- Redux Toolkit & React Query
- Material-UI (MUI)
- Tailwind CSS
- Framer Motion

### Backend
- Django 5.1
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Celery (for async tasks)

### DevOps
- Docker & Docker Compose
- Nginx (for production)
- AWS S3 (for media storage)

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hypertube.git
   cd hypertube
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp HyperTubeFront/.env.example HyperTubeFront/.env
   ```

3. **Build and start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## 📂 Project Structure

```
.
├── backend/               # Django backend
│   ├── users/            # User authentication
│   ├── movies/           # Movie-related logic
│   └── manage.py         # Django management
│
├── HyperTubeFront/       # Next.js frontend
│   ├── src/             # Source code
│   └── public/          # Static files
│
├── docker-compose.yml    # Docker configuration
└── README.md            # This file
```

## 🌐 API Documentation

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user

### Movies
- `GET /api/movies/` - List all movies
- `GET /api/movies/search/` - Search movies
- `GET /api/movies/<id>/` - Get movie details
- `POST /api/movies/<id>/watch/` - Mark as watched

### Comments
- `GET /api/comments/` - List all comments
- `POST /api/comments/` - Create a comment
- `GET|PUT|DELETE /api/comments/<id>/` - Manage comments

## 🧪 Testing

Run tests for the backend:
```bash
docker-compose run backend python manage.py test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- [YTS API](https://yts.mx/api) for torrent data
- [Material-UI](https://mui.com/) for UI components
- [Next.js](https://nextjs.org/) for the React framework

---

Made with ❤️ by the HyperTube Team
