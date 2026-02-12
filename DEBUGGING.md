# React Debugging Setup Guide

This guide explains how to run backend services in Docker while running the React app locally for debugging.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 16+ installed locally
- npm installed locally

## Step 1: Stop Existing Containers

If services are currently running, stop them:

```bash
docker compose down
```

## Step 2: Start Only Backend Services

Run the debug compose file that excludes the React frontend:

```bash
docker compose -f docker-compose.debug.yml up -d
```

This starts:
- PostgreSQL database (port 5432)
- FastAPI backend (port 8000)
- pgAdmin (port 5050)

Verify services are running:

```bash
docker compose -f docker-compose.debug.yml ps
```

Check backend logs:

```bash
docker compose -f docker-compose.debug.yml logs backend --tail 10
```

## Step 3: Install React Dependencies (First Time Only)

In PowerShell, navigate to the frontend directory:

```bash
cd frontend
npm install
```

## Step 4: Start React in Development Mode

From the `frontend` directory, start the React development server with:

```bash
npm start
```

This will:
- Start the React dev server on http://localhost:3000
- Open your browser automatically
- Enable hot-reload - changes save and refresh automatically
- Show compilation errors in the browser console

## Step 5: Access All Services

While React is running, you can access:

- **React App**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Root**: http://localhost:8000/
- **pgAdmin**: http://localhost:5050

## Debugging Tips

### View Console Output
- Press `F12` in the browser to open Developer Tools
- Go to the **Console** tab to see React errors and warnings
- Check the **Network** tab to inspect API calls

### View Backend Logs
In a separate terminal:

```bash
docker compose -f docker-compose.debug.yml logs backend -f
```

The `-f` flag follows logs in real-time.

### View Database Logs
```bash
docker compose -f docker-compose.debug.yml logs db -f
```

### Restart Backend Without Restarting Database
```bash
docker compose -f docker-compose.debug.yml restart backend
```

### Stop Everything
Press `Ctrl+C` in the React terminal, then stop Docker services:

```bash
docker compose -f docker-compose.debug.yml down
```

## Workflow

**Terminal 1 - Backend Services**:
```bash
docker compose -f docker-compose.debug.yml up -d
# or watch logs with:
docker compose -f docker-compose.debug.yml logs -f
```

**Terminal 2 - React Development**:
```bash
cd frontend
npm start
```

**Terminal 3 - Optional - Inspect Backend**:
```bash
docker compose -f docker-compose.debug.yml logs backend -f
```

## Common Issues

### Port Already in Use

If port 3000 is in use, specify a different port:

```bash
PORT=3001 npm start
```

### Backend Not Responding

Ensure backend is running:

```bash
docker compose -f docker-compose.debug.yml ps
```

Check API health:

```bash
Invoke-WebRequest http://localhost:8000/ -UseBasicParsing
```

### Database Connection Error

Verify database is healthy:

```bash
docker compose -f docker-compose.debug.yml logs db --tail 10
```

Wait a few seconds and try again - database needs time to initialize.

### Hot-Reload Not Working

Kill the npm process and restart:

```bash
# Press Ctrl+C in the terminal running npm start
npm start
```

## Benefits of This Setup

✅ **Fast Iteration**: Changes to React code reflect immediately (hot-reload)
✅ **Better Debugging**: Use browser DevTools and see console errors in real-time
✅ **Source Maps**: Debug your source code, not the compiled version
✅ **Easy Backend Testing**: Backend continues running while you debug frontend
✅ **Isolated Changes**: React changes don't affect containerized services

## When to Use Production Build

After debugging, test the production build:

```bash
cd frontend
npm run build
docker compose up -d
```

This ensures your app works with Docker compilation/bundling.
