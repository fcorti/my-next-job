from datetime import datetime
import os
from app.models import JobOpportunity, JobRole, Watchlist
from .content_analyser import ContentAnalyser
from .career_page import CareerPage
from .job_description import JobDescription

class JobSearcher:
    
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
                existing.last_update = datetime.now()
                self.db.commit()
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
        self.logger.write("Checking the Watchlist.")

        # Fetch the active job role.
        active_job_role = self.db.query(JobRole).filter(JobRole.id == id_active_role).first()
        if not active_job_role:
            self.logger.write(f"Active job role with id {id_active_role} not found. Stopping search.")
            return

        # Fetch watchlist entries for the active role.
        watchlist = self.db.query(Watchlist).filter(
            Watchlist.job_role_id == id_active_role
        ).all()
        
        if not watchlist:
            self.logger.write("Watchlist empty for this role. Stopping search.")
            return
        self.logger.write(f"Found {len(watchlist)} URLs in the Watchlist.")
        
        for entry in watchlist:

            self.logger.write("")
            self.logger.write(f"Checking: {entry.url} (last visit:{entry.last_visit}, page type:{entry.page_type}).")

            career_page = CareerPage(entry.url, entry.page_type, self.logger)

            content_analyser = ContentAnalyser(self.logger, inference_url=os.environ.get("INFERENCE_URL"), timeout=int(os.environ.get("INFERENCE_TIMEOUT")), model_name=os.environ.get("MODEL_NAME_FOR_CAREER_PAGE"), max_characters_for_career_page_analysis=int(os.environ.get("MAX_CHARACTERS_FOR_CAREER_PAGE_ANALYSIS", 6000)))

            try:

                job_descriptions = career_page.get_job_descriptions()

#                 job_descriptions = []
#                 job_descriptions.append(JobDescription(
#                         description="Web Experience Manager",
#                         url="https://jobs.ashbyhq.com/kong/a5386015-0a8a-4a12-9e5a-d021b4474d22")
#                 )
#                 job_descriptions.append(JobDescription(
#                         description="Senior Program Manager, Security Engineering",
#                         url="https://jobs.ashbyhq.com/kong/eba0b07d-752a-47c9-a585-71049677b55d")
#                 )
#                 job_descriptions.append(JobDescription(
#                         description="GRC Program Manager",
#                         url="https://jobs.ashbyhq.com/kong/fd577e37-cde8-46e7-806f-debc40eab30a")
#                 )

                opportunities_in_career_page = 0
                opportunities_skipped_in_career_page = 0

                for job_description in job_descriptions:

                    self.logger.write(f"  Checking job description: {job_description.description}.")

                    self.job_descriptions += 1
                    if self.max_job_descriptions and self.job_descriptions >= self.max_job_descriptions:
                        self.logger.write(f"")
                        self.logger.write(f"Max job descriptions reached ({self.max_job_descriptions}). Stopping search.")
                        return

                    # Get score based on the job description content only.
                    score = content_analyser.get_score_for_job_name(job_description, active_job_role)

                    self.logger.write(f"    Score based on job name: {score}.")

                    # Get score based on the full job description.
                    if score >= self.score_threshold:

                        # Fetch the full job description content.
                        fetched = career_page.fetch(job_description)
                        if not fetched:
                            self.logger.write(f"    Failed to fetch full job description. Skipping")
                            opportunities_skipped_in_career_page += 1
                            continue

                        score = content_analyser.get_score_for_full_job_description(job_description, active_job_role)

                        self.logger.write(f"    Score based on full job description: {score}.")

                    # Filtering based on the score threshold 
                    if score >= self.score_threshold:

                        self.opportunities += 1
                        if self.max_opportunities and self.opportunities >= self.max_opportunities:
                            self.logger.write(f"")
                            self.logger.write(f"Max opportunities reached ({self.max_opportunities}). Stopping search.")
                            return

                        saved = self.save_opportunity(job_description.url, score, id_active_role)
                        if saved:
                            opportunities_in_career_page += 1
                            self.logger.write(f"    Job Description saved as an opportunity.")
                        else:
                            opportunities_skipped_in_career_page += 1
                            self.logger.write(f"    Job Description already saved as an opportunity. Last visit updated.")

                    else:
                        opportunities_skipped_in_career_page += 1
                        self.logger.write(f"    Job Description below threshold. Skipping.")

                self.logger.write(f"  Job descriptions found: {len(job_descriptions)}.")
                self.logger.write(f"  New opportunities found: {opportunities_in_career_page}.")
                self.logger.write(f"  Opportunities still active: {opportunities_skipped_in_career_page}.")

                entry.last_visit = datetime.now()
                self.db.commit()

            except Exception as e:
                self.logger.write(f"  Error processing {entry.url}: {str(e)}")
            
        self.logger.write("End of check for the Watchlist.")
