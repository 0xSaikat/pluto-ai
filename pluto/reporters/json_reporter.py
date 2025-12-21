import json
from typing import List, Dict

class JSONReporter:
    def generate(self, vulnerabilities: List[Dict], output_file: str):
        """Generate JSON report"""
        report = {
            "total_vulnerabilities": len(vulnerabilities),
            "severity_summary": self._get_severity_summary(vulnerabilities),
            "vulnerabilities": vulnerabilities
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
    
    def _get_severity_summary(self, vulnerabilities: List[Dict]) -> Dict:
        summary = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
        for vuln in vulnerabilities:
            severity = vuln.get('severity', 'LOW')
            summary[severity] = summary.get(severity, 0) + 1
        return summary
