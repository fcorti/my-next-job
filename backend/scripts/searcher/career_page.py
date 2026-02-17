"""CareerPage class for fetching and parsing job listings from URLs"""

import os
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from .content_analyser import ContentAnalyser
from .job_description import JobDescription
from bs4 import BeautifulSoup

class CareerPage:
    
    def __init__(self, url, page_type, logger, timeout=60000):
        self.url = url
        self.page_type = page_type
        self.logger = logger
        self.timeout = timeout
        self.html_content = None
    
    def fetch(self, job_description=None) -> bool:

        if job_description:
            url = job_description.url
        else:
            url = self.url
 
        try:
 
            with sync_playwright() as p:
 
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                )
                page = context.new_page()
                page.goto(url, wait_until="networkidle")

                if job_description:
                    job_description.html_content = page.content()
                else:
                    self.html_content = page.content()

                browser.close()
            
        except Exception as e:
            raise Exception(f"Error fetching {url}: {str(e)}")

        return True

    def get_job_descriptions(self) -> list[JobDescription]:

        job_descriptions = []

        match self.page_type:

            case "ashbyhq":

                # Fetch the career page content.
                self.fetch()

                if self.logger.verbose:
                    self.logger.write(f"  Fetched HTML content of length {len(self.html_content)} characters")

                # Preparing the base url.
                url_parts = urlsplit(self.url)
                base_url = f"{url_parts.scheme}://{url_parts.netloc}"

                # Extract job descriptions from the career page content.
                soup = BeautifulSoup(self.html_content, 'html.parser')
                for anchor in soup.find_all('a', href=True):
                    if anchor['href'].startswith("/"):
                        job_description = JobDescription(
                            description=anchor.get_text(strip=True),
                            url=base_url + anchor['href']
                        )
                        job_descriptions.append(job_description)
                
                self.logger.write(f"  Extracted {len(job_descriptions)} job descriptions from the page containing {len(soup.find_all('a', href=True))} links")

            case _:
                self.logger.write(f"  No specific parsing logic for page type '{self.page_type}', skipping the career page analysis")

        return job_descriptions
