from typing import List, Dict
from datetime import datetime
import os

class PDFReporter:
    def generate(self, vulnerabilities: List[Dict], output_file: str):
        """Generate PDF report with logo"""
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
            from reportlab.lib import colors
            from reportlab.lib.enums import TA_CENTER
        except ImportError:
            print("Error: reportlab not installed. Install with: pip install reportlab")
            return
        
        doc = SimpleDocTemplate(output_file, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        logo_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'logo.png')
        if os.path.exists(logo_path):
            try:
                logo = Image(logo_path, width=2*inch, height=2*inch)
                logo.hAlign = 'CENTER'
                story.append(logo)
                story.append(Spacer(1, 0.3*inch))
            except:
                pass
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#00CED1'),
            spaceAfter=10,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        story.append(Paragraph("🛡️ PLUTO SECURITY REPORT 🛡️", title_style))
        
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER,
            spaceAfter=20,
        )
        story.append(Paragraph("AI-Powered Code Security Analyzer", subtitle_style))
        story.append(Paragraph("by 0xSaikat | hackbit.org", subtitle_style))
        story.append(Spacer(1, 0.3*inch))
        
        story.append(Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        story.append(Paragraph(f"<b>Total Vulnerabilities Found:</b> {len(vulnerabilities)}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        severity_count = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
        for vuln in vulnerabilities:
            severity = vuln.get('severity', 'LOW')
            severity_count[severity] = severity_count.get(severity, 0) + 1
        
        data = [['Severity Level', 'Count', 'Priority']]
        for severity in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
            count = severity_count[severity]
            priority = '🔴' if severity == 'CRITICAL' else '🟠' if severity == 'HIGH' else '🟡' if severity == 'MEDIUM' else '🟢'
            data.append([severity, str(count), priority])
        
        table = Table(data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00CED1')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        story.append(table)
        story.append(Spacer(1, 0.5*inch))
        
        vuln_header_style = ParagraphStyle(
            'VulnHeader',
            parent=styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#00CED1'),
            spaceAfter=20,
        )
        story.append(Paragraph("📋 Detailed Vulnerability Findings", vuln_header_style))
        story.append(Spacer(1, 0.2*inch))
        
        if not vulnerabilities:
            story.append(Paragraph("✅ <b>No vulnerabilities detected!</b>", styles['Normal']))
        else:
            severity_colors = {
                'CRITICAL': colors.HexColor('#FF0000'),
                'HIGH': colors.HexColor('#FF6600'),
                'MEDIUM': colors.HexColor('#FFA500'),
                'LOW': colors.HexColor('#00AA00')
            }
            
            for i, vuln in enumerate(vulnerabilities, 1):
                severity = vuln.get('severity', 'LOW')
                severity_color = severity_colors.get(severity, colors.black)
                
                vuln_title_style = ParagraphStyle(
                    'VulnTitle',
                    parent=styles['Heading3'],
                    fontSize=14,
                    textColor=severity_color,
                    spaceAfter=10,
                )
                
                story.append(Paragraph(f"<b>[{i}] {severity} - {vuln.get('type', 'Unknown')}</b>", vuln_title_style))
                
                if vuln.get('line'):
                    story.append(Paragraph(f"<b>📍 Location:</b> Line {vuln['line']}", styles['Normal']))
                
                story.append(Paragraph(f"<b>📝 Description:</b> {vuln.get('description', 'N/A')}", styles['Normal']))
                story.append(Paragraph(f"<b>💥 Impact:</b> {vuln.get('impact', 'N/A')}", styles['Normal']))
                story.append(Paragraph(f"<b>✅ Recommendation:</b> {vuln.get('recommendation', 'N/A')}", styles['Normal']))
                story.append(Spacer(1, 0.3*inch))
        
        story.append(Spacer(1, 0.5*inch))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER,
        )
        story.append(Paragraph("─" * 80, footer_style))
        story.append(Paragraph("Generated by Pluto v1.0 | hackbit.org", footer_style))
        story.append(Paragraph("AI-Powered Security Analysis Tool", footer_style))
        
        doc.build(story)
