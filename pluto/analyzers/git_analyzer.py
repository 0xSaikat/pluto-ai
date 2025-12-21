import os
import tempfile
import shutil
from git import Repo

class GitAnalyzer:
    def clone_repo(self, repo_url: str) -> str:
        """Clone a git repository to a temporary directory"""
        temp_dir = tempfile.mkdtemp(prefix='pluto_')
        try:
            Repo.clone_from(repo_url, temp_dir, depth=1)
            return temp_dir
        except Exception as e:
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise Exception(f"Failed to clone repository: {str(e)}")