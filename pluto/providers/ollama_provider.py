import json
from typing import List, Dict
import requests

class OllamaProvider:
    def __init__(self, model: str = 'codellama'):
        self.model = model
        self.base_url = "http://localhost:11434"
    
    def analyze_code(self, code: str, file_path: str) -> List[Dict]:
        """Analyze code using Ollama"""
        prompt = self._create_prompt(code, file_path)
        
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                result_text = result.get('response', '')
                return self._parse_response(result_text)
            else:
                print(f"Ollama API error: {response.status_code}")
                return []
        except requests.exceptions.ConnectionError:
            print("Error: Cannot connect to Ollama. Make sure Ollama is running (ollama serve)")
            return []
        except Exception as e:
            print(f"Error calling Ollama: {str(e)}")
            return []
    
    def _create_prompt(self, code: str, file_path: str) -> str:
        return f"""Analyze this code for security vulnerabilities.

File: {file_path}

Code:
```
{code}
```

Find security issues like: SQL injection, XSS, hardcoded secrets, insecure crypto, command injection, etc.

Return ONLY a JSON array. Format:
[{{"severity": "CRITICAL|HIGH|MEDIUM|LOW", "type": "issue type", "line": number, "description": "what's wrong", "impact": "potential damage", "recommendation": "how to fix"}}]

If no issues, return []. JSON only, no explanation."""
    
    def _parse_response(self, response: str) -> List[Dict]:
        """Parse Ollama response"""
        try:
            start = response.find('[')
            end = response.rfind(']') + 1
            
            if start != -1 and end > start:
                json_str = response[start:end]
                vulnerabilities = json.loads(json_str)
                
                for vuln in vulnerabilities:
                    severity = vuln.get('severity', 'LOW')

                    if '|' in severity:
                        levels = severity.split('|')
                        if 'CRITICAL' in levels:
                            vuln['severity'] = 'CRITICAL'
                        elif 'HIGH' in levels:
                            vuln['severity'] = 'HIGH'
                        elif 'MEDIUM' in levels:
                            vuln['severity'] = 'MEDIUM'
                        else:
                            vuln['severity'] = 'LOW'
                    else:
                        
                        severity = severity.upper().strip()
                        if severity not in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
                            vuln['severity'] = 'MEDIUM'
                        else:
                            vuln['severity'] = severity
                
                return vulnerabilities
            return []
        except json.JSONDecodeError:
            return []