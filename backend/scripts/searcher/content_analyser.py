"""ContentAnalyser class for extracting job descriptions using AI"""

import requests
import json
from typing import List, Dict
from urllib.parse import urlsplit
from bs4 import BeautifulSoup

class ContentAnalyser:
    
    def __init__(self, logger, inference_url, timeout, model_name, max_chars_per_chunk):
        self.logger = logger
        self.headers = {"Content-Type": "application/json"}
        self.inference_url = inference_url
        self.model_name = model_name
        self.max_chars_per_chunk = max_chars_per_chunk
        self.timeout = timeout

    def _extract_job_descriptions_from_ashbyhq(self, career_page) -> List[Dict[str, str]]:

        # Preparing the base url.
        url_parts = urlsplit(career_page.url)
        base_url = f"{url_parts.scheme}://{url_parts.netloc}"

        soup = BeautifulSoup(career_page.html_content, 'html.parser')

        if self.logger.verbose:
            self.logger.write(f"  Found {len(soup.find_all('a', href=True))} links into the career page")

        job_descriptions = []        
        for anchor in soup.find_all('a', href=True):
            if anchor['href'].startswith("/"):
                job_description = {
                    'url': base_url + anchor['href'],
                    'title': anchor.get_text(strip=True)
                }
                job_descriptions.append(job_description)
        
        if self.logger.verbose:
            self.logger.write(f"  Extracted {len(job_descriptions)} job descriptions from the page")

        return job_descriptions
    
    def _call_inference(self,chat_request="Hi") -> dict:

        response = requests.post(
            self.inference_url,
            headers=self.headers,
            json={
            "model": self.model_name,
            "messages": [
                {
                    "role": "user",
                    "content": chat_request
                }
            ]},
            timeout=self.timeout
        )
        
        if response.status_code != 200:
            raise Exception(f"API returned status code {response.status_code}: {response.text}")

        return response.json()

    def _chunk_html(self, html_content, max_chars):
        if not html_content:
            return []

        chunks = []
        start = 0
        length = len(html_content)
        while start < length:
            end = min(start + max_chars, length)
            chunks.append(html_content[start:end])
            start = end

        return chunks

    def get_job_descriptions_from_career_page(self, career_page) -> List[Dict[str, str]]:

        job_descriptions = []

        match career_page.page_type:

                case "ashbyhq":

                    if self.logger.verbose:
                        self.logger.write("  Analyzing AshbyHQ career page content to extract job descriptions")
                    
                    job_descriptions = self._extract_job_descriptions_from_ashbyhq(career_page)

                case _:
                    self.logger.write(f"  No specific content analysis logic for page type '{career_page.page_type}', skipping the job description extraction") 

        return job_descriptions
