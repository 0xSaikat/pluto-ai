import os
import json
from typing import List, Dict

class OpenAIProvider:
    def __init__(self, model: str = 'gpt-4'):
        self.model = model
        try:
            from openai import OpenAI
            api_key = os.environ.get('OPENAI_API_KEY')
            if not api_key:
                raise ValueError("OPENAI_API_KEY environment variable not set")
            self.client = OpenAI(api_key=api_key)
        except ImportError:
            raise ImportError("Please install: pip install openai")
    
    def analyze_code(self, code: str, file_path: str) -> List[Dict]:
        """Analyze code using OpenAI"""
        prompt = self._create_prompt(code, file_path)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a security expert analyzing code for vulnerabilities."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            result_text = response.choices[0].message.content
            vulnerabilities = self._parse_response(result_text)
            return vulnerabilities
        except Exception as e:
            print(f"Error calling OpenAI API: {str(e)}")
            return []
    
    def _create_prompt(self, code: str, file_path: str) -> str:
        return f"""Analyze the following code for security vulnerabilities.

File: {file_path}

Code:
```
{code}
```

Return ONLY a JSON array of vulnerabilities. Format:
[
  {{
    "severity": "CRITICAL|HIGH|MEDIUM|LOW",
    "type": "vulnerability type",
    "line": line_number,
    "description": "description",
    "impact": "impact",
    "recommendation": "fix"
  }}
]

If no vulnerabilities, return []."""
    
    def _parse_response(self, response: str) -> List[Dict]:
        """Parse AI response to extract vulnerabilities"""
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
