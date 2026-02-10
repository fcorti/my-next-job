# My Next Job

A full-stack web application to help manage your job search journey. The application guides you through three key steps in sequence:

1. **Skills & Experience** - Build your professional profile
2. **Find Opportunities** - Discover job opportunities
3. **Manage Pipeline** - Track and manage your applications

## Architecture

- **Backend**: FastAPI running on Python 3.11
- **Frontend**: React 18 (modern SPA) with React Router for multi-page navigation
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
├── frontend/                # React Frontend with multi-page routing
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.js      # Landing page (sequential workflow overview)
│   │   │   ├── SkillsPage.js    # Step 1: Skills & Experience
│   │   │   ├── OpportunitiesPage.js  # Step 2: Find Opportunities
│   │   │   └── PipelinePage.js  # Step 3: Manage Pipeline (CRUD)
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── .gitignore
├── docker-compose.yml
├── LICENSE
├── .gitignore
└── README.md
```

## Application Flow

The application guides users through a structured three-step job search process:

**Step 1: Skills & Experience**
- Route: `/skills`
- Purpose: Manage and showcase your professional profiles
- Features: 
  - View all job roles in a table format
  - Each role includes: name, CV file, and active status
  - Activate/deactivate job roles with a single click
  - Only one role can be active at a time
- Status: ✅ Implemented with database persistence

**Step 2: Find Opportunities**
- Route: `/opportunities`
- Purpose: Search and discover relevant job opportunities
- Status: Placeholder for future enhancements

**Step 3: Manage Pipeline**
- Route: `/pipeline`
- Purpose: Track and manage job applications
- Features: Create, view, and delete application notes with timestamps
- Status: ✅ Fully implemented

Each step is accessible via the navigation bar at the top of the application, with numbered indicators (1, 2, 3) to show the sequential workflow.

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

The application uses two main tables:

**Table: `messages`**
| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-incrementing |
| `text` | VARCHAR(255) | Message content (required) |
| `created_at` | TIMESTAMP | Creation timestamp with timezone (auto-set) |

**Table: `job_roles`**
| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-incrementing |
| `name` | VARCHAR(255) | Job role name (unique identifier, required) |
| `cv_filename` | VARCHAR(255) | CV file name/path (required) |
| `is_active` | BOOLEAN | Active status flag (only one role can be active) |
| `created_at` | TIMESTAMP | Creation timestamp with timezone (auto-set) |

**Sample Data**: The `job_roles` table is automatically populated with 5 sample job roles on application startup: Senior Full Stack Developer, Backend Engineer, Frontend Developer, DevOps Engineer, and Data Engineer.

## pgAdmin - Database Management

pgAdmin 4 is included for easy PostgreSQL database management. 

**Access pgAdmin:**
- URL: http://localhost:5050
- Email: `admin@example.com`
- Password: `admin`

### Auto-Registered Server

The PostgreSQL server is automatically registered in pgAdmin on startup through the `pgadmin/servers.json` configuration file. This means:

- ✅ **No manual server configuration needed** - the database connection is auto-loaded
- ✅ **Persistent across rebuilds** - configuration survives container restarts
- ✅ **Server name**: `my-next-job-db`
- ✅ **Connection details**: Already configured to connect to the internal database

**How it works:**
- A `servers.json` file in the `pgadmin/` folder defines the server connection
- This file is mounted into pgAdmin's configuration directory
- On startup, pgAdmin automatically loads servers from this file
- The configuration persists in the pgAdmin volume (`pgadmin_data`)

You can immediately log in to pgAdmin and start browsing the database without any additional setup!

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
