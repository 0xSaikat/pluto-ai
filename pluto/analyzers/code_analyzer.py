from typing import List, Dict, Optional
import json

class CodeAnalyzer:
    def __init__(self, provider: str = 'claude', model: str = 'claude-sonnet-4-20250514'):
        self.provider = provider
        self.model = model
        
        if provider == 'claude':
            from pluto.providers.claude_provider import ClaudeProvider
            self.ai_provider = ClaudeProvider(model)
        elif provider == 'openai':
            from pluto.providers.openai_provider import OpenAIProvider
            self.ai_provider = OpenAIProvider(model)
        elif provider == 'ollama':
            from pluto.providers.ollama_provider import OllamaProvider
            self.ai_provider = OllamaProvider(model)
        else:
            raise ValueError(f"Unknown provider: {provider}")
    
    def analyze_file(self, file_path: str) -> List[Dict]:
        """Analyze a single file for vulnerabilities"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                code = f.read()
            
            if not code.strip():
                return []
            
            vulnerabilities = self.ai_provider.analyze_code(code, file_path)
            return vulnerabilities
        except Exception as e:
            print(f"Error analyzing {file_path}: {str(e)}")
            return []