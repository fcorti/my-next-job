"""CareerPage class for fetching and parsing job listings from URLs"""

import os
from playwright.sync_api import sync_playwright
from .content_analyser import ContentAnalyser
from bs4 import BeautifulSoup


class CareerPage:
    """Handles fetching and parsing career pages"""
    
    def __init__(self, url, page_type, logger, timeout=60000):
        self.url = url
        self.page_type = page_type
        self.logger = logger
        self.timeout = timeout
        self.html_content = None
    
    def fetch(self) -> bool:
 
        try:
 
            with sync_playwright() as p:
 
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                )
                page = context.new_page()
                page.goto(self.url, wait_until="networkidle")
                self.html_content = page.content()
                browser.close()
                return True
            
        except Exception as e:
            raise Exception(f"Error fetching {self.url}: {str(e)}")
    
    def get_job_descriptions(self) -> list[dict[str, str]]:

        job_descriptions = []

        match self.page_type:

            case "ashbyhq":

                self.fetch()

                if self.logger.verbose:
                    self.logger.write(f"  Fetched HTML content of length {len(self.html_content)} characters")

                content_analyser = ContentAnalyser(
                    self.logger,
                    os.getenv("INFERENCE_URL"),
                    int(os.getenv("INFERENCE_TIMEOUT")),
                    os.getenv("MODEL_NAME_FOR_CAREER_PAGE"),
                    int(os.getenv("MAX_CHARS_FOR_CONTEXT"))
                )

                job_descriptions = content_analyser.get_job_descriptions_from_career_page(self)

            case _:
                self.logger.write(f"  No specific parsing logic for page type '{self.page_type}', skipping the career page analysis")

        return job_descriptions
