from typing import List, Dict
from datetime import datetime

class MarkdownReporter:
    def generate(self, vulnerabilities: List[Dict], output_file: str):
        """Generate Markdown report"""
        lines = []
        lines.append("# Pluto Security Scan Report\n")
        lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        lines.append(f"**Total Vulnerabilities:** {len(vulnerabilities)}\n")
        
        severity_count = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
        for vuln in vulnerabilities:
            severity = vuln.get('severity', 'LOW')
            severity_count[severity] = severity_count.get(severity, 0) + 1
        
        lines.append("\n## Severity Summary\n")
        lines.append("| Severity | Count |\n")
        lines.append("|----------|-------|\n")
        for severity, count in severity_count.items():
            lines.append(f"| {severity} | {count} |\n")
        
        lines.append("\n## Detailed Findings\n")
        for i, vuln in enumerate(vulnerabilities, 1):
            lines.append(f"\n### [{i}] {vuln.get('severity', 'LOW')} - {vuln.get('type', 'Unknown')}\n")
            lines.append(f"**Description:** {vuln.get('description', 'N/A')}\n\n")
            lines.append(f"**Impact:** {vuln.get('impact', 'N/A')}\n\n")
            lines.append(f"**Recommendation:** {vuln.get('recommendation', 'N/A')}\n")
            if vuln.get('line'):
                lines.append(f"**Line:** {vuln['line']}\n")
            lines.append("\n---\n")
        
        with open(output_file, 'w') as f:
            f.writelines(lines)
