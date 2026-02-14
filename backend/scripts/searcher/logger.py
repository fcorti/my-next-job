"""Logger class for writing to console and log file"""

from datetime import datetime


class Logger:
    """Handles logging to both console and file"""
    
    def __init__(self, log_path=None, verbose=False):
        self.log_path = log_path
        self.verbose = verbose
        self.log_file = None
    
    def create_file(self):
        self.log_file = open(self.log_path, 'w')

    def write(self, message):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        if self.log_file:
            self.log_file.write(log_message + "\n")
            self.log_file.flush()
