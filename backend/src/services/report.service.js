const { Report, Vulnerability, Scan, Project } = require('../models/index');
const PDFDocument = require('pdfkit');

const generateReport = async (scanId) => {
  const scan = await Scan.findByPk(scanId, {
    include: [
      {
        model: Vulnerability,
        as: 'Vulnerabilities',
      },
      {
        model: Project,
        as: 'Project',
        attributes: ['project_name'],
      },
    ],
  });

  if (!scan) throw new Error('Scan not found');

  const vulnerabilities = scan.Vulnerabilities || [];

  const reportData = {
    scan_id: scanId,
    project_name: scan.Project ? scan.Project.project_name : 'Unknown',
    scan_type: scan.scan_type,
    scan_date: scan.scan_date,
    risk_score: scan.risk_score,
    status: scan.status,
    summary: {
      total_vulnerabilities: vulnerabilities.length,
      critical: vulnerabilities.filter((v) => v.severity === 'CRITICAL').length,
      high: vulnerabilities.filter((v) => v.severity === 'HIGH').length,
      medium: vulnerabilities.filter((v) => v.severity === 'MEDIUM').length,
      low: vulnerabilities.filter((v) => v.severity === 'LOW').length,
    },
    vulnerabilities: vulnerabilities.map((v) => ({
      name: v.vulnerability_name,
      severity: v.severity,
      cwe_id: v.cwe_id,
      description: v.description,
      recommendation: v.recommendation,
      status: v.status,
    })),
    generated_at: new Date(),
  };

  const [report] = await Report.upsert({
    scan_id: scanId,
    generated_date: new Date(),
    report_data: reportData,
    report_file: `report_scan_${scanId}.json`,
  });

  return report;
};

/**
 * Generate Markdown string from report data
 */
const generateMarkdownReport = (reportData) => {
  let md = `# 🛡️ Pluto AI — Security Analysis Report\n\n`;
  md += `**Project**: ${reportData.project_name}  \n`;
  md += `**Scan ID**: ${reportData.scan_id}  \n`;
  md += `**Scan Type**: ${reportData.scan_type}  \n`;
  md += `**Scan Date**: ${new Date(reportData.scan_date).toLocaleString()}  \n`;
  md += `**Overall Risk Score**: **${reportData.risk_score} / 100**  \n\n`;

  md += `---  \n\n`;
  md += `### 📊 Vulnerability Summary\n\n`;
  md += `- **Total Vulnerabilities**: ${reportData.summary.total_vulnerabilities}\n`;
  md += `- **Critical**: ${reportData.summary.critical}\n`;
  md += `- **High**: ${reportData.summary.high}\n`;
  md += `- **Medium**: ${reportData.summary.medium}\n`;
  md += `- **Low**: ${reportData.summary.low}\n\n`;

  md += `---  \n\n`;
  md += `### ⚠️ Detailed Findings\n\n`;

  if (reportData.vulnerabilities.length === 0) {
    md += `*No vulnerabilities detected in this scan.*\n`;
  } else {
    reportData.vulnerabilities.forEach((v, index) => {
      md += `#### ${index + 1}. ${v.name} (${v.cwe_id})\n`;
      md += `- **Severity**: \`${v.severity}\`\n`;
      md += `- **Status**: \`${v.status}\`\n`;
      md += `- **Description**: ${v.description}\n`;
      md += `- **Remediation**: ${v.recommendation}\n\n`;
    });
  }

  md += `\n---\n*Report generated automatically by Pluto AI Security Analyzer.*`;
  return md;
};

/**
 * Stream PDF report generated with pdfkit
 */
const buildPDFReportStream = (reportData, res) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="pluto_security_report_${reportData.scan_id}.pdf"`
  );

  doc.pipe(res);

  // Header banner
  doc
    .fillColor('#00bcd4')
    .fontSize(22)
    .text('Pluto AI — Code Security Report', { align: 'center' });
  doc.moveDown(0.5);

  doc
    .fillColor('#555555')
    .fontSize(10)
    .text(`Generated at: ${new Date(reportData.generated_at).toLocaleString()}`, {
      align: 'center',
    });
  doc.moveDown(1.5);

  // Meta Table Box
  doc
    .rect(40, doc.y, 530, 80)
    .fillAndStroke('#f5f7fa', '#e0e0e0');

  doc.fillColor('#111111').fontSize(11);
  doc.text(`Project Name: ${reportData.project_name}`, 55, 115);
  doc.text(`Scan ID: ${reportData.scan_id}`, 55, 130);
  doc.text(`Scan Type: ${reportData.scan_type}`, 55, 145);
  doc.text(`Risk Score: ${reportData.risk_score} / 100`, 350, 115);
  doc.text(`Total Threats: ${reportData.summary.total_vulnerabilities}`, 350, 130);

  doc.moveDown(3);

  // Summary Breakdown
  doc.fillColor('#111111').fontSize(14).text('Vulnerability Summary');
  doc.moveDown(0.5);
  doc.fontSize(10);
  doc.text(`- Critical: ${reportData.summary.critical}`);
  doc.text(`- High: ${reportData.summary.high}`);
  doc.text(`- Medium: ${reportData.summary.medium}`);
  doc.text(`- Low: ${reportData.summary.low}`);
  doc.moveDown(1.5);

  // Vulnerability List
  doc.fillColor('#111111').fontSize(14).text('Detailed Vulnerabilities');
  doc.moveDown(0.5);

  if (reportData.vulnerabilities.length === 0) {
    doc.fillColor('#00c853').fontSize(11).text('No security vulnerabilities found!');
  } else {
    reportData.vulnerabilities.forEach((v, index) => {
      const color =
        v.severity === 'CRITICAL'
          ? '#ff1744'
          : v.severity === 'HIGH'
          ? '#ff6d00'
          : v.severity === 'MEDIUM'
          ? '#ffd600'
          : '#00c853';

      doc
        .fillColor(color)
        .fontSize(11)
        .text(`${index + 1}. ${v.name} [${v.severity}] (${v.cwe_id})`);
      doc
        .fillColor('#333333')
        .fontSize(9)
        .text(`Description: ${v.description}`);
      doc
        .fillColor('#008000')
        .fontSize(9)
        .text(`Fix: ${v.recommendation}`);
      doc.moveDown(1);
    });
  }

  doc.end();
};

module.exports = {
  generateReport,
  generateMarkdownReport,
  buildPDFReportStream,
};