#!/usr/bin/env python3
"""
Job Search Script - Searches for job opportunities matching the active role.

Usage:
    python scripts/search_jobs.py --score-threshold 85
    python scripts/search_jobs.py --score-threshold 90 --max-results 100
"""

import sys
from pathlib import Path
from datetime import datetime
import click

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import JobRole, SearchSession
from searcher import JobSearcher


@click.command()
@click.option('--score-threshold', '-s', default=80, type=int, 
              help='Minimum score threshold for opportunities (default: 80)')
@click.option('--max-opportunities', '-o', default=None, type=int,
              help='Maximum number of opportunities to return (default: unlimited)')
@click.option('--max-job-descriptions', '-d', default=None, type=int,
              help='Maximum number of job descriptions to process (default: unlimited)')
@click.option('--log-dir', '-l', default='logs',
              help='Directory to store log files (default: logs)')
def search_jobs(score_threshold, max_opportunities, max_job_descriptions, log_dir):

    start_time = datetime.now()
    
    # Create log directory
    log_dir_path = Path(__file__).parent.parent / log_dir
    log_dir_path.mkdir(exist_ok=True)
    
    # Create log file
    log_filename = f"search_session_{start_time.strftime('%Y%m%d_%H%M%S')}.log"
    log_path = log_dir_path / log_filename
    
    db = SessionLocal()
    session_id = None
    
    try:
        with open(log_path, 'w') as log_file:
            searcher = JobSearcher(db, log_file, score_threshold, max_opportunities, max_job_descriptions)
            
            searcher.log("=" * 80)
            searcher.log("JOB SEARCH SESSION STARTED")
            searcher.log("=" * 80)
            searcher.log(f"Score threshold: {score_threshold}")
            searcher.log(f"Max opportunities: {max_opportunities if max_opportunities else 'unlimited'}")
            searcher.log(f"Max job descriptions: {max_job_descriptions if max_job_descriptions else 'unlimited'}")
            searcher.log(f"Log file: {log_path}")
            
            # Get active role
            active_role = db.query(JobRole).filter(JobRole.is_active == True).first()
            if not active_role:
                searcher.log("ERROR: No active job role found!")
                return
                        
            searcher.log(f"Active Role: {active_role.name}")
            
            # Create search session record
            search_session = SearchSession(
                job_role_id=active_role.id,
                start_datetime=start_time,
                score_threshold=score_threshold,
                log_file_path=str(log_path)
            )
            db.add(search_session)
            db.commit()
            db.refresh(search_session)
            session_id = search_session.id
            
            searcher.log(f"Search Session ID: {session_id}")

            searcher.opportunities_found = 0
            searcher.opportunities_saved = 0
            
            searcher.check_watchlist(active_role.id)
            
            # Update search session with end time
            end_time = datetime.now()
            search_session.end_datetime = end_time
            db.commit()

            duration = (end_time - start_time).total_seconds()

            searcher.log("-" * 80)
            searcher.log("SEARCH SESSION COMPLETED")
            searcher.log(f"Duration: {duration:.2f} seconds")
            searcher.log(f"New opportunities found: {searcher.opportunities_found}")
            searcher.log(f"Session ID: {session_id}")
            searcher.log("=" * 80)
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Mark session as failed (no end time)
        if session_id:
            try:
                session = db.query(SearchSession).filter(SearchSession.id == session_id).first()
                if session:
                    # Keep end_datetime as None to indicate error
                    db.commit()
            except:
                pass
    
    finally:
        db.close()


if __name__ == '__main__':
    search_jobs()
