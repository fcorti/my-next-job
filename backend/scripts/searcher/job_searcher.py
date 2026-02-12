"""JobSearcher class for searching job opportunities"""

from datetime import datetime
from app.models import JobOpportunity, Watchlist
from .career_page import CareerPage


class JobSearcher:
    """Handles job search operations"""
    
    def __init__(self, db, log_file, score_threshold, max_opportunities, max_job_descriptions):
        self.db = db
        self.log_file = log_file
        self.score_threshold = score_threshold
        self.max_opportunities = max_opportunities
        self.max_job_descriptions = max_job_descriptions
        self.job_descriptions = 0
        self.opportunities = 0
        
    def log(self, message):
        """Write message to both console and log file"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        if self.log_file:
            self.log_file.write(log_message + "\n")
            self.log_file.flush()
    
    def save_opportunity(self, url, score, active_role_id):

        try:
            existing = self.db.query(JobOpportunity).filter(
                JobOpportunity.url == url,
                JobOpportunity.job_role_id == active_role_id
            ).first()
            
            if existing:
                return False
            
            new_opp = JobOpportunity(
                url=url,
                job_role_id=active_role_id,
                score=score,
                status="New",
                last_update=datetime.now()
            )
            self.db.add(new_opp)
            self.db.commit()

            return True
            
        except Exception as e:
            self.db.rollback()
            self.log(f"Error saving opportunity: {str(e)}")
            return False
    
    def check_watchlist(self, id_active_role):

        self.log("-" * 80)
        self.log("Checking the Watchlist")

        watchlist = self.db.query(Watchlist).filter(
            Watchlist.job_role_id == id_active_role
        ).all()
        
        if not watchlist:
            self.log("WARNING: Watchlist empty for this role")
            return
        self.log(f"Found {len(watchlist)} URLs in the Watchlist")
        
        for entry in watchlist:
            self.log(f"Checking: {entry.url}")
            self.log(f"")

            try:
                career_page = CareerPage(entry.url)
                career_page.fetch()
                
                job_descriptions = career_page.get_job_descriptions()
                self.log(f"  Found {len(job_descriptions)} job descriptions on the page")
            
                opportunities_in_career_page = 0
                opportunities_skipped_in_career_page = 0

                for job_description in job_descriptions:

                    self.job_descriptions += 1
                    if self.max_job_descriptions and self.job_descriptions >= self.max_job_descriptions:
                        self.log(f"")
                        self.log(f"Max job descriptions reached ({self.max_job_descriptions}), stopping search")
                        return

                    # TODO
                    score = 100
                    
                    if score >= self.score_threshold:

                        self.opportunities += 1
                        if self.max_opportunities and self.opportunities >= self.max_opportunities:
                            self.log(f"")
                            self.log(f"Max opportunities reached ({self.max_opportunities}), stopping search")
                            return

                        saved = self.save_opportunity(job_description['url'], score, id_active_role)
                        if saved:
                            opportunities_in_career_page += 1
                            self.log(f"  Saved opportunity: {job_description['url']} (score: {score})")
                        else:
                            opportunities_skipped_in_career_page += 1
                            self.log(f"  Opportunity already exists: {job_description['url']} (score: {score})")

                    else:
                        opportunities_skipped_in_career_page += 1
                        self.log(f"  Opportunity below threshold: {job_description['url']} (score: {score})")

            except Exception as e:
                self.log(f"  Error processing {entry.url}: {str(e)}")
            
            self.log(f"  Job descriptions found: {len(job_descriptions)}")
            self.log(f"  Opportunities found: {opportunities_in_career_page}")
            self.log(f"  Opportunities skipped: {opportunities_skipped_in_career_page}")
            self.log("")

        self.log("End of check for the Watchlist")
    























    def search_url(self, url, active_role_id, score_threshold):
        try:
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
