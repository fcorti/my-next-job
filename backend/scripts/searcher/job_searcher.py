"""JobSearcher class for searching job opportunities"""

from datetime import datetime
from app.models import JobOpportunity, Watchlist
from .career_page import CareerPage
from .logger import Logger


class JobSearcher:
    """Handles job search operations"""
    
    def __init__(self, db, logger, score_threshold, max_opportunities, max_job_descriptions):
        self.db = db
        self.logger = logger
        self.score_threshold = score_threshold
        self.max_opportunities = max_opportunities
        self.max_job_descriptions = max_job_descriptions
        self.job_descriptions = 0
        self.opportunities = 0
    
    def save_opportunity(self, url, score, active_role_id) -> bool:

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
            self.logger.write(f"Error saving opportunity: {str(e)}")
            return False
    
    def check_watchlist(self, id_active_role):

        self.logger.write("-" * 80)
        self.logger.write("Checking the Watchlist")

        watchlist = self.db.query(Watchlist).filter(
            Watchlist.job_role_id == id_active_role
        ).all()
        
        if not watchlist:
            self.logger.write("WARNING: Watchlist empty for this role")
            return
        self.logger.write(f"Found {len(watchlist)} URLs in the Watchlist")
        
        for entry in watchlist:

            self.logger.write("")
            self.logger.write(f"Checking: {entry.url} (last visit:{entry.last_visit}, page type:{entry.page_type})")

            try:
                career_page = CareerPage(entry.url, entry.page_type, self.logger)
                job_descriptions = career_page.get_job_descriptions()
                self.logger.write(f"  Found {len(job_descriptions)} job descriptions on the page")
            
                opportunities_in_career_page = 0
                opportunities_skipped_in_career_page = 0

                for job_description in job_descriptions:

                    self.job_descriptions += 1
                    if self.max_job_descriptions and self.job_descriptions >= self.max_job_descriptions:
                        self.logger.write(f"")
                        self.logger.write(f"Max job descriptions reached ({self.max_job_descriptions}), stopping search")
                        return

                    # TODO
                    score = 100
                    
                    if score >= self.score_threshold:

                        self.opportunities += 1
                        if self.max_opportunities and self.opportunities >= self.max_opportunities:
                            self.logger.write(f"")
                            self.logger.write(f"Max opportunities reached ({self.max_opportunities}), stopping search")
                            return

                        saved = self.save_opportunity(job_description['url'], score, id_active_role)
                        if saved:
                            opportunities_in_career_page += 1
                            self.logger.write(f"  Saved opportunity: {job_description['url']} (score: {score})")
                        else:
                            opportunities_skipped_in_career_page += 1
                            self.logger.write(f"  Opportunity already exists: {job_description['url']} (score: {score})")

                    else:
                        opportunities_skipped_in_career_page += 1
                        self.logger.write(f"  Opportunity below threshold: {job_description['url']} (score: {score})")

                self.logger.write(f"  Job descriptions found: {len(job_descriptions)}")
                self.logger.write(f"  Opportunities found: {opportunities_in_career_page}")
                self.logger.write(f"  Opportunities skipped: {opportunities_skipped_in_career_page}")

                entry.last_visit = datetime.now()
                self.db.commit()

            except Exception as e:
                self.logger.write(f"  Error processing {entry.url}: {str(e)}")
            
        self.logger.write("End of check for the Watchlist")
