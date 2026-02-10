# My Next Job Application - FastAPI + PostgreSQL + Docker

A full-stack web application demonstrating FastAPI backend, PostgreSQL database, and Docker containerization.

## Architecture

- **Backend**: FastAPI running on Python 3.11
- **Frontend**: React 18 (modern SPA) with component-based architecture
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Project Structure

```
my-next-job/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # Database configuration
│   │   └── models.py        # SQLAlchemy models
│   ├── Dockerfile
│   └── requirements.txt     # Python dependencies
├── frontend-react/          # Modern React Frontend (active)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── .gitignore

├── docker-compose.yml
├── .gitignore
└── README.md
```

## Prerequisites

- Docker Desktop (already installed)
- Docker Compose

## Quick Start

1. **Clone/Navigate to the project directory**:
   ```bash
   cd my-next-job
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the backend Docker image
   - Start PostgreSQL database
   - Start the FastAPI backend
   - Start the frontend HTTP server

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## API Endpoints
Modern React Frontend** with component-based architecture
- ✅ **REST API** with CRUD operations for messages
- ✅ **PostgreSQL Database** for persisting messages
- ✅ **Web Frontend** with a clean, responsive UI
- ✅ **Server Health Check** to verify connection
- ✅ **Message Management** - Create, read, and delete messages
- ✅ **Error Handling** with user-friendly messages
- ✅ **CORS Enabled** for frontend-backend communication
- ✅ **pgAdmin** for database management and visualization
- ✅ **Docker Compose** for easy multi-container orchestration

The application includes:

- ✅ **REST API** with CRUD operations for messages
- ✅ **PostgreSQL Database** for persisting messages
- ✅ **Web Frontend** with a clean, responsive UI
- ✅ **Server Health Check** to verify connection
- ✅ **Message Management** - Create, read, and delete messages
- ✅ **Error Handling** with user-friendly messages
- ✅ **CORS Enabled** for frontend-backend communication
- ✅ **pgAdmin** for database management and visualization
- ✅ **Docker Compose** for easy multi-container orchestration

## Stopping the Application

Press `Ctrl + C` in the terminal where Docker Compose is running, or run:

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Development Mode

The React frontend also runs in development mode with hot-reload. Changes to files in the `./frontend-react/src` directory will automatically refresh the browser.

The backend runs in development mode with hot-reload. Changes to files in the `./backend` directory will automatically restart the server.

## Database

PostgreSQL runs on `localhost:5432` with:
- Username: `postgres`
- Password: `postgres`
- Database: `my_next_job_db`

Tables are automatically created on application startup.

### Database Schema

The application uses a single table:

**Table: `messages`**
| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-incrementing |
| `text` | VARCHAR(255) | Message content (required) |
| `created_at` | TIMESTAMP | Creation timestamp with timezone (auto-set) |

## Troubleshooting

### Port Already in Use
If ports 3000, 8000, or 5432 are already in use, you can modify the port mappings in `docker-compose.yml`.

### Database Connection Issues
Ensure the DB service is healthy by checking:
```bash
docker-compose ps
```

The backend will wait for the database to be ready before starting.

### Clear Everything
To completely reset the application:
```bash
docker-compose down -v
docker system prune -a
```

---

Happy coding! 🚀
