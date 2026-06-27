const { Report, Vulnerability, Scan, Project } = require('../models/index');

const generateReport = async (scanId) => {
  // Get scan with all related data
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

  // Build report data object
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

  // Save or update report in database
  const [report] = await Report.upsert({
    scan_id: scanId,
    generated_date: new Date(),
    report_data: reportData,
    report_file: `report_scan_${scanId}.json`,
  });

  return report;
};

module.exports = { generateReport };