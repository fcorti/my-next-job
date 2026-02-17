import re
import requests
from bs4 import BeautifulSoup

class ContentAnalyser:
    
    def __init__(self, logger, inference_url, timeout, model_name, max_characters_for_career_page_analysis):
        self.logger = logger
        self.headers = {"Content-Type": "application/json"}
        self.inference_url = inference_url
        self.model_name = model_name
        self.timeout = timeout
        self.max_characters_for_career_page_analysis = max_characters_for_career_page_analysis
    
    def _get_inference_json(self,type=None,chat_request="Hi") -> dict:

        inference_json = {
            "model": self.model_name,
            "messages": [
                {"role": "user", "content": chat_request}
            ]
        }

        match type:

            case "job_name":
   
                # Tuned for Mistral 7B-Q4 model.

                inference_json["messages"].insert(0, {
                    "role": "system",
                    "content": (
                        "You are a professional Technical Recruiter."
                        "Your task is to compare a Job Description with a Target Job Role."
                        "You must ALWAYS start your response with 'SCORE: [number]' followed by a brief 'Analysis'."
                )})

                inference_json["temperature"] = 0.2 # Use a moderate temperature to allow for some variability in the responses while still keeping them focused and relevant to the task of scoring job descriptions.
                inference_json["top_p"] = 0.95 # Use nucleus sampling to allow for more diverse responses while still focusing on the most relevant ones.
                inference_json["max_tokens"] = 300 # Limit the response to a reasonable length since we only need a score and maybe a brief analysis, not a long explanation.
                inference_json["cache_prompt"] = True # Cache the prompt to improve performance for similar requests in the future.
                inference_json["stop"] = ["[/INST]", "Job Description:", "Target Job Role:"] # Stop tokens to prevent the model from generating unwanted text after the score. 
   
            case "full_job_description":

                # Tuned for Mistral 7B-Q4 model.

                inference_json["messages"].insert(0, {
                    "role": "system",
                    "content": (
                        "You are a professional Technical Recruiter."
                        "Compare Target Role vs Job Description."
                        "Focus ONLY on Hard Skills & Experience."
                        "Ignore benefits and company info."
                        "You must ALWAYS start your response with 'SCORE: [number]' followed by a brief 'Analysis'."
                )})

                inference_json["temperature"] = 0.0 # Use a low temperature to make the model's responses more deterministic and focused on the specific task of scoring the job description based on its content, which is important for consistency in scoring across different job descriptions.
                inference_json["top_p"] = 0.95 # Use nucleus sampling to allow for more diverse responses while still focusing on the most relevant ones.
                inference_json["max_tokens"] = 300 # Limit the response to a reasonable length since we only need a score and maybe a brief analysis, not a long explanation.
                inference_json["cache_prompt"] = True # Cache the prompt to improve performance for similar requests in the future.
                inference_json["stop"] = ["[/INST]", "Job Description:", "Target Job Role:"] # Stop tokens to prevent the model from generating unwanted text after the score. 

        return inference_json

    def _call_inference(self,type=None, chat_request="Hi") -> dict:

        response = requests.post(
            self.inference_url,
            headers=self.headers,
            json=self._get_inference_json(type=type, chat_request=chat_request),
            timeout=self.timeout
        )
        
        if response.status_code != 200:
            raise Exception(f"API returned status code {response.status_code}: {response.text}")

        return response.json()

    def get_score_for_job_name(self, job_description, active_job_role) -> int:
        # Calculate the score based on the job descriptions only.

        chat_request = (
            f"[INST] Target Job Role: {active_job_role.name}\n"
            "\n"
            f"Job Description: {job_description.description}\n"
            "\n"
            "EVALUATION STEPS:\n"
            "1. Extract core requirements.\n"
            "2. Compare with Target Role.\n"
            "3. List 2-3 brief bullet points of gaps.\n"
            "\n"
            "FORMAT:\n"
            "SCORE: <0-100>\n"
            "Analysis: <brief_explanation>\n"
            "[/INST] SCORE: " # The space after SCORE: is intentional to help the model understand that the score should come immediately after it without any other text in between.
        )

        response = self._call_inference(type="job_name", chat_request=chat_request)

        # Cleaning the response to extract only the score.
        response_content = response.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        score_str = response_content.upper().strip()
        score_str = re.search(r"(?:SCORE:\s*)?(\d+)", score_str)
        try:
            score = int(score_str.group(1))
        except (ValueError, AttributeError):
            self.logger.write(f"WARNING: Inference's answer did not contain a valid score. Skipping the job opportunity.")
            score = 0

        if self.logger.verbose:
            self.logger.write(f"Inference API response: {response}")
            self.logger.write(f"Extracted score: {score}")

        return score

    def get_score_for_full_job_description(self, job_description, active_job_role) -> int:
        # Calculate the score based on the full job description.

        if not job_description.html_content:
            raise ValueError("html_content for job_description is required for calculating score based on full job description")

        # Cleaning the HTML content to extract only the text for better scoring.
        text_content = BeautifulSoup(job_description.html_content, "html.parser").get_text(separator=" ", strip=True)
        text_content = text_content[:self.max_characters_for_career_page_analysis] # Truncate the text content to avoid exeeding the 4kb of context.

        chat_request = (
            f"[INST] You are a professional Technical Recruiter."
            "Analyze the match between the provided Job Description and the Target Job Role."
            "Start your response with the score."
            "Task: Score match 0-100 and list 2-3 main gaps.\n"
            "\n"
            "FORMAT:\n"
            "SCORE: <0-100>\n"
            "Analysis: <gaps>\n"
            "\n"
            f"Target Job Role: {active_job_role.name}\n"
            "\n"
            f"Job Description: {text_content}\n"
            "\n"
            "[/INST] SCORE: " # The space after SCORE: is intentional to help the model understand that the score should come immediately after it without any other text in between.
        )

        response = self._call_inference(type="full_job_description", chat_request=chat_request)

        # Cleaning the response to extract only the score.
        response_content = response.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        score_str = response_content.upper().strip()
        score_str = re.search(r"(?:SCORE:\s*)?(\d+)", score_str)
        try:
            score = int(score_str.group(1))
        except (ValueError, AttributeError):
            self.logger.write(f"WARNING: Inference's answer did not contain a valid score. Skipping the job opportunity.")
            score = 0;

        if self.logger.verbose:
            self.logger.write(f"Inference API response: {response}")
            self.logger.write(f"Extracted score: {score}")

        return score
