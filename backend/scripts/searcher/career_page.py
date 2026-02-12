"""CareerPage class for fetching and parsing job listings from URLs"""

import requests
from bs4 import BeautifulSoup


class CareerPage:
    """Handles fetching and parsing career pages"""
    
    def __init__(self, url, timeout=10):
        self.url = url
        self.timeout = timeout
        self.soup = None
        
    def fetch(self):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                             '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(self.url, headers=headers, timeout=self.timeout)
            response.raise_for_status()
            
            # Parse HTML
            self.soup = BeautifulSoup(response.content, 'html.parser')
            return True
            
        except requests.RequestException as e:
            raise Exception(f"Error fetching {self.url}: {str(e)}")
    
    def get_job_descriptions(self):

        if not self.soup:
            raise Exception("Page not fetched. Call fetch() first.")
        
        job_descriptions = []

        job_descriptions.append({
            'title': "test",
            'url': "http://test.com"
        })

        return job_descriptions
