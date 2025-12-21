import os
import json
from typing import List, Dict

class ClaudeProvider:
    def __init__(self, model: str = 'claude-sonnet-4-20250514'):
        self.model = model
        try:
            from anthropic import Anthropic
            api_key = os.environ.get('ANTHROPIC_API_KEY')
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY environment variable not set")
            self.client = Anthropic(api_key=api_key)
        except ImportError:
            raise ImportError("Please install: pip install anthropic")
    
    def analyze_code(self, code: str, file_path: str) -> List[Dict]:
        """Analyze code using Claude"""
        prompt = self._create_prompt(code, file_path)
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            result_text = response.content[0].text
            
            vulnerabilities = self._parse_response(result_text)
            return vulnerabilities
        except Exception as e:
            print(f"Error calling Claude API: {str(e)}")
            return []
    
    def _create_prompt(self, code: str, file_path: str) -> str:
        return f"""Analyze the following code for security vulnerabilities. Focus on:

1. SQL Injection
2. XSS (Cross-Site Scripting)
3. Authentication/Authorization issues
4. Hardcoded secrets/credentials
5. Insecure cryptography
6. Path traversal
7. Command injection
8. CSRF vulnerabilities
9. Insecure dependencies
10. Buffer overflows
11. Race conditions
12. Logic flaws

File: {file_path}

Code:
```
{code}
```

For each vulnerability found, provide a JSON object with:
- severity: "CRITICAL", "HIGH", "MEDIUM", or "LOW"
- type: vulnerability type
- line: approximate line number (if identifiable)
- description: what's vulnerable
- impact: potential damage
- recommendation: how to fix

Return ONLY a JSON array of vulnerabilities. If no vulnerabilities found, return an empty array [].
Do not include any explanation, just the JSON array."""
    
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
            print("Failed to parse JSON response")
            return []
