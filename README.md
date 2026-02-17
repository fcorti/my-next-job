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

## Application Flow

The application guides users through a structured three-step job search process:

**Step 1: Skills & Experience**
- Route: `/skills`
- Purpose: Manage your professional profiles and CVs
- Features: 
  - Add/modify job roles with unique names
  - Upload CV files for each role
  - Activate/deactivate roles (only one active at a time)
  - Delete roles with confirmation dialog
  - Sort roles alphabetically (A-Z / Z-A)
  - Clean, responsive table layout
- Status: ✅ Fully implemented

**Step 2: Find Opportunities**
- Route: `/opportunities`
- Purpose: Search, filter, and manage job opportunities
- Features:
  - Display all opportunities with URL, match score, and status
  - Filter opportunities by status (New/Ignore) with multi-select checkboxes
  - Update opportunity status via dropdown menu
  - Sort opportunities alphabetically (A-Z / Z-A)
  - One-click clean all opportunities with confirmation
  - Search functionality to find and add opportunities
  - View active job role in use
- Status: ✅ Fully implemented

**Step 3: Manage Pipeline**
- Route: `/pipeline`
- Purpose: Track and manage your job application pipeline
- Features: Template ready for custom pipeline management features
- Status: ✅ Ready for implementation

**Bonus Feature: Watchlist**
- Route: `/watchlist`
- Purpose: Keep track of interesting opportunities
- Features:
  - View all watchlist entries
  - Modify watchlist entries
  - Delete entries with confirmation
  - Sort entries alphabetically (A-Z / Z-A)
  - Track last visit date
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

2. **Create your environment file**:
  ```bash
  cp .env.example .env
  ```

  On Windows PowerShell:
  ```powershell
  Copy-Item .env.example .env
  ```

3. **Start the application**:
   ```bash
  docker compose up --build
   ```

   This command will:
   - Build the backend Docker image
   - Start PostgreSQL database
   - Start the FastAPI backend
   - Start the frontend HTTP server

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Key Features

- ✅ **Modern React Frontend** with component-based architecture and responsive design
- ✅ **REST API** with full CRUD operations for jobs, opportunities, and watchlist
- ✅ **PostgreSQL Database** for persistent data storage
- ✅ **Job Role Management** - Create, read, update, and delete job roles
- ✅ **CV File Upload** - Attach and manage CV files for each role
- ✅ **Opportunity Tracking** - Manage job opportunities with status and scoring
- ✅ **Status Filtering** - Filter opportunities by status (New/Ignore)
- ✅ **Watchlist Management** - Save and track interesting opportunities
- ✅ **Smart Sorting** - Sort opportunities and watchlist entries alphabetically
- ✅ **Confirmation Dialogs** - Prevent accidental deletions with user confirmations
- ✅ **Error Handling** - User-friendly error messages and validation
- ✅ **CORS Enabled** - Seamless frontend-backend communication
- ✅ **pgAdmin** - Database management and visualization
- ✅ **Docker Compose** - Easy multi-container orchestration and deployment

## Stopping the Application

Press `Ctrl + C` in the terminal where Docker Compose is running, or run:

```bash
docker compose down
```

To also remove volumes (database data):

```bash
docker compose down -v
```

## Development Mode

The React frontend also runs in development mode with hot-reload. Changes to files in the `./frontend/src` directory will automatically refresh the browser.

The backend runs in development mode with hot-reload. Changes to files in the `./backend` directory will automatically restart the server.

## Job Search Script

The backend includes a job search runner at `backend/scripts/search_jobs.py`.

Run it from the project root:

```bash
docker compose exec backend python scripts/search_jobs.py --score-threshold 80
```

Common options:
- `--score-threshold` / `-s`: Minimum score threshold (default: `80`)
- `--max-opportunities` / `-o`: Max opportunities to return
- `--max-job-descriptions` / `-d`: Max job descriptions to process
- `--log-dir` / `-l`: Log output directory (default: `logs`)
- `--verbose` / `-v`: Enable verbose logging (`true`/`false`)

Example:

```bash
docker compose exec backend python scripts/search_jobs.py --score-threshold 50 --verbose false
```

## Database Configuration

PostgreSQL runs on `localhost:5432` with:
- Username: `postgres`
- Password: `postgres`
- Database: `my_next_job_db`

Database schema is automatically created and managed by SQLAlchemy ORM on application startup.

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
docker compose ps
```

The backend will wait for the database to be ready before starting.

### Clear Everything
To completely reset the application:
```bash
docker compose down -v
docker system prune -a
```

---

Happy coding! 🚀
