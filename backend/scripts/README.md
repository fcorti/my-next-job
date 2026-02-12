# Job Search Scripts

This directory contains CLI scripts for automated job searching.

## search_jobs.py

Search watchlist URLs for job opportunities matching your active role.

### Usage

**Basic usage (default threshold 80):**
```bash
docker compose exec backend python scripts/search_jobs.py
```

**With custom score threshold:**
```bash
docker compose exec backend python scripts/search_jobs.py --score-threshold 85
```

**With max results limit:**
```bash
docker compose exec backend python scripts/search_jobs.py --score-threshold 90 --max-results 50
```

**All options:**
```bash
docker compose exec backend python scripts/search_jobs.py \
  --score-threshold 85 \
  --max-results 100 \
  --log-dir logs
```

### Options

- `--score-threshold, -s`: Minimum score for opportunities (default: 80)
- `--max-results, -m`: Maximum number of results (default: unlimited)
- `--log-dir, -l`: Directory for log files (default: logs)

### What it does

1. Gets your active job role
2. Fetches all watchlist URLs for that role
3. Searches each URL for job opportunities
4. Saves new opportunities to the database
5. Creates a search session record with logs
6. All activity is logged to `backend/logs/search_session_YYYYMMDD_HHMMSS.log`

### View Results

- Go to **Find Opportunities** page to see new opportunities
- Go to **Search Sessions** page to view session history and logs
- Check the database for detailed records
