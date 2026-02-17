class JobDescription:
    def __init__(self, description: str, url: str, html_content: str = None):
        if description is None:
            raise ValueError("description cannot be null")
        if url is None:
            raise ValueError("url cannot be null")
        if not isinstance(description, str):
            raise TypeError("description must be a string")
        if not isinstance(url, str):
            raise TypeError("url must be a string")

        self.description = description
        self.url = url
        self.html_content = html_content
