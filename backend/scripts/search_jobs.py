#!/usr/bin/env python3
"""
Job Search Script - Searches for job opportunities matching the active role.

Usage:
    python scripts/search_jobs.py --score-threshold 85
    python scripts/search_jobs.py --score-threshold 90 --max-results 100
"""

import sys
import os
from pathlib import Path
from datetime import datetime
import click
import requests
from bs4 import BeautifulSoup

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import JobRole, Watchlist, JobOpportunity, SearchSession


class JobSearcher:
    """Handles job search operations"""
    
    def __init__(self, db, log_file):
        self.db = db
        self.log_file = log_file
        self.opportunities_found = 0
        
    def log(self, message):
        """Write message to both console and log file"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        if self.log_file:
            self.log_file.write(log_message + "\n")
            self.log_file.flush()
    
    def search_url(self, url, active_role_id, score_threshold):
        """
        Search a single URL for job opportunities.
        
        This is a placeholder implementation. In production, this would:
        - Fetch the page content
        - Parse job listings
        - Extract job URLs and details
        - Score them based on CV/keywords match
        - Return opportunities above threshold
        """
        self.log(f"Searching: {url}")
        
        try:
            # Placeholder: In production, fetch and parse the actual page
            # For now, generate sample opportunities based on the URL
            opportunities = []
            
            # Simulate finding 2-4 opportunities per URL
            import random
            num_opps = random.randint(2, 4)
            
            for i in range(num_opps):
                score = random.randint(score_threshold - 10, 100)
                if score >= score_threshold:
                    opp_url = f"{url}/job-posting-{random.randint(1000, 9999)}"
                    opportunities.append({
                        'url': opp_url,
                        'score': score
                    })
            
            self.log(f"  Found {len(opportunities)} opportunities above threshold {score_threshold}")
            return opportunities
            
        except Exception as e:
            self.log(f"  Error searching {url}: {str(e)}")
            return []
    
    def save_opportunity(self, url, score, active_role_id):
        """Save opportunity to database if it doesn't already exist"""
        try:
            # Check if already exists
            existing = self.db.query(JobOpportunity).filter(
                JobOpportunity.url == url,
                JobOpportunity.job_role_id == active_role_id
            ).first()
            
            if existing:
                self.log(f"  Skipping duplicate: {url}")
                return False
            
            # Create new opportunity
            new_opp = JobOpportunity(
                url=url,
                job_role_id=active_role_id,
                score=score,
                status="New",
                last_update=datetime.now()
            )
            self.db.add(new_opp)
            self.db.commit()
            self.opportunities_found += 1
            self.log(f"  Saved: {url} (score: {score})")
            return True
            
        except Exception as e:
            self.db.rollback()
            self.log(f"  Error saving opportunity: {str(e)}")
            return False


@click.command()
@click.option('--score-threshold', '-s', default=80, type=int, 
              help='Minimum score threshold for opportunities (default: 80)')
@click.option('--max-results', '-m', default=None, type=int,
              help='Maximum number of results to return (default: unlimited)')
@click.option('--log-dir', '-l', default='logs',
              help='Directory to store log files (default: logs)')
def search_jobs(score_threshold, max_results, log_dir):
    """
    Search for job opportunities matching the active role.

    This command will:
    1. Get the active job role
    2. Fetch all watchlist URLs for that role
    3. Search each URL for job opportunities
    4. Save new opportunities to the database
    5. Create a search session record
    """
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
            searcher = JobSearcher(db, log_file)
            
            searcher.log("=" * 80)
            searcher.log("JOB SEARCH SESSION STARTED")
            searcher.log("=" * 80)
            searcher.log(f"Score threshold: {score_threshold}")
            searcher.log(f"Max results: {max_results if max_results else 'unlimited'}")
            searcher.log(f"Log file: {log_path}")
            searcher.log("")
            
            # Get active role
            active_role = db.query(JobRole).filter(JobRole.is_active == True).first()
            if not active_role:
                searcher.log("ERROR: No active job role found!")
                return
            
            searcher.log(f"Active Role: {active_role.name}")
            searcher.log("")
            
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
            searcher.log("")
            
            # Get watchlist
            watchlist = db.query(Watchlist).filter(
                Watchlist.job_role_id == active_role.id
            ).all()
            
            if not watchlist:
                searcher.log("WARNING: No URLs in watchlist for this role!")
                return
            
            searcher.log(f"Found {len(watchlist)} URLs in watchlist")
            searcher.log("-" * 80)
            searcher.log("")
            
            # Search each URL
            for entry in watchlist:
                opportunities = searcher.search_url(entry.url, active_role.id, score_threshold)
                
                # Save opportunities
                saved_count = 0
                for opp in opportunities:
                    if max_results and searcher.opportunities_found >= max_results:
                        searcher.log("Max results reached, stopping search")
                        break
                    
                    if searcher.save_opportunity(opp['url'], opp['score'], active_role.id):
                        saved_count += 1
                
                if max_results and searcher.opportunities_found >= max_results:
                    break
                
                searcher.log("")
            
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
