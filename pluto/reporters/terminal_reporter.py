from typing import List, Dict

class TerminalReporter:
    COLORS = {
        'CRITICAL': '\033[91m',  
        'HIGH': '\033[93m',      
        'MEDIUM': '\033[94m',    
        'LOW': '\033[92m',       
        'RESET': '\033[0m',
        'BOLD': '\033[1m'
    }
    
    def generate(self, vulnerabilities: List[Dict]):
        """Generate terminal report"""
        if not vulnerabilities:
            print(f"\n{self.COLORS['BOLD']}✓ No vulnerabilities found!{self.COLORS['RESET']}\n")
            return
        
        print(f"\n{self.COLORS['BOLD']}{'='*80}{self.COLORS['RESET']}")
        print(f"{self.COLORS['BOLD']}PLUTO SECURITY SCAN REPORT{self.COLORS['RESET']}")
        print(f"{self.COLORS['BOLD']}{'='*80}{self.COLORS['RESET']}\n")
        
        severity_count = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
        for vuln in vulnerabilities:
            severity = vuln.get('severity', 'LOW')
            severity_count[severity] = severity_count.get(severity, 0) + 1
        
        print(f"Total Issues: {len(vulnerabilities)}")
        print(f"  {self.COLORS['CRITICAL']}● CRITICAL: {severity_count['CRITICAL']}{self.COLORS['RESET']}")
        print(f"  {self.COLORS['HIGH']}● HIGH: {severity_count['HIGH']}{self.COLORS['RESET']}")
        print(f"  {self.COLORS['MEDIUM']}● MEDIUM: {severity_count['MEDIUM']}{self.COLORS['RESET']}")
        print(f"  {self.COLORS['LOW']}● LOW: {severity_count['LOW']}{self.COLORS['RESET']}\n")
        
        for i, vuln in enumerate(vulnerabilities, 1):
            severity = vuln.get('severity', 'LOW')
            color = self.COLORS.get(severity, self.COLORS['RESET'])
            
            print(f"{color}{self.COLORS['BOLD']}[{i}] {severity}{self.COLORS['RESET']}")
            print(f"Type: {vuln.get('type', 'Unknown')}")
            
            if vuln.get('line'):
                print(f"Line: {vuln['line']}")
            
            print(f"Description: {vuln.get('description', 'N/A')}")
            print(f"Impact: {vuln.get('impact', 'N/A')}")
            print(f"Recommendation: {vuln.get('recommendation', 'N/A')}")
            print(f"{'-'*80}\n")