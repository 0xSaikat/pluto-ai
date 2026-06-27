const { body } = require('express-validator');
const {
  Scan,
  Project,
  SourceCode,
  Vulnerability,
  Report,
} = require('../models/index');
const { analyzeCode } = require('../services/mockAI.service');
const { generateReport } = require('../services/report.service');
const { logActivity } = require('../services/activity.service');

// Validation rules
const scanValidation = [
  body('project_id')
    .notEmpty().withMessage('Project ID is required')
    .isInt().withMessage('Project ID must be a number'),

  body('scan_type')
    .notEmpty().withMessage('Scan type is required')
    .isIn(['paste', 'upload', 'github'])
    .withMessage('Scan type must be paste, upload, or github'),

  body('source_content')
    .if(body('scan_type').isIn(['paste', 'upload']))
    .notEmpty().withMessage('Source code content is required'),

  body('github_url')
    .if(body('scan_type').equals('github'))
    .notEmpty().withMessage('GitHub URL is required')
    .isURL().withMessage('Please provide a valid GitHub URL'),
];

// CREATE SCAN — triggers mock AI analysis
const createScan = async (req, res, next) => {
  try {
    const { project_id, scan_type, source_content, github_url } = req.body;

    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: project_id, user_id: req.user.id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Step 1 — Create scan record with pending status
    const scan = await Scan.create({
      project_id,
      scan_type,
      status: 'pending',
      scan_date: new Date(),
      risk_score: 0,
    });

    // Step 2 — Store source code
    await SourceCode.create({
      scan_id: scan.id,
      source_type: scan_type,
      source_content: source_content || null,
      github_url: github_url || null,
    });

    // Step 3 — Update status to running
    await scan.update({ status: 'running' });

    await logActivity(req.user.id, `Scan started for project: ${project.project_name}`);

    // Step 4 — Run mock AI analysis
    const aiResult = await analyzeCode(source_content || github_url, scan_type);

    // Step 5 — Save vulnerabilities to database
    const vulnerabilityRecords = await Promise.all(
      aiResult.vulnerabilities.map((vuln) =>
        Vulnerability.create({
          scan_id: scan.id,
          vulnerability_name: vuln.vulnerability_name,
          severity: vuln.severity,
          cwe_id: vuln.cwe_id,
          description: vuln.description,
          recommendation: vuln.recommendation,
          status: 'open',
        })
      )
    );

    // Step 6 — Update scan with results
    await scan.update({
      status: 'completed',
      risk_score: aiResult.risk_score,
    });

    // Step 7 — Generate report automatically
    await generateReport(scan.id);

    await logActivity(
      req.user.id,
      `Scan completed for project: ${project.project_name} — ${vulnerabilityRecords.length} vulnerabilities found`
    );

    res.status(201).json({
      success: true,
      message: 'Scan completed successfully',
      scan: {
        id: scan.id,
        project_id: scan.project_id,
        scan_type: scan.scan_type,
        status: 'completed',
        risk_score: aiResult.risk_score,
        scan_date: scan.scan_date,
      },
      summary: aiResult.summary,
      vulnerabilities: vulnerabilityRecords,
    });

  } catch (error) {
    next(error);
  }
};

// GET ALL SCANS for logged in user
const getScans = async (req, res, next) => {
  try {
    const scans = await Scan.findAll({
      include: [
        {
          model: Project,
          as: 'Project',
          where: { user_id: req.user.id },
          attributes: ['project_name'],
        },
      ],
      order: [['scan_date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: scans.length,
      scans,
    });

  } catch (error) {
    next(error);
  }
};

// GET ONE SCAN with full details
const getScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Project,
          as: 'Project',
          where: { user_id: req.user.id },
          attributes: ['project_name'],
        },
        {
          model: SourceCode,
          as: 'SourceCode',
          attributes: ['source_type', 'github_url'],
        },
        {
          model: Vulnerability,
          as: 'Vulnerabilities',
        },
        {
          model: Report,
          as: 'Report',
          attributes: ['id', 'generated_date', 'report_file'],
        },
      ],
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found',
      });
    }

    res.status(200).json({
      success: true,
      scan,
    });

  } catch (error) {
    next(error);
  }
};

// RESCAN — run analysis again on same code
const rescan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Project,
          as: 'Project',
          where: { user_id: req.user.id },
        },
        {
          model: SourceCode,
          as: 'SourceCode',
        },
      ],
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found',
      });
    }

    // Delete old vulnerabilities
    await Vulnerability.destroy({ where: { scan_id: scan.id } });

    // Reset scan status
    await scan.update({ status: 'running', risk_score: 0 });

    // Run analysis again
    const sourceContent = scan.SourceCode
      ? scan.SourceCode.source_content || scan.SourceCode.github_url
      : null;

    const aiResult = await analyzeCode(sourceContent, scan.scan_type);

    // Save new vulnerabilities
    await Promise.all(
      aiResult.vulnerabilities.map((vuln) =>
        Vulnerability.create({
          scan_id: scan.id,
          vulnerability_name: vuln.vulnerability_name,
          severity: vuln.severity,
          cwe_id: vuln.cwe_id,
          description: vuln.description,
          recommendation: vuln.recommendation,
          status: 'open',
        })
      )
    );

    // Update scan
    await scan.update({
      status: 'completed',
      risk_score: aiResult.risk_score,
      scan_date: new Date(),
    });

    // Regenerate report
    await generateReport(scan.id);

    await logActivity(req.user.id, `Rescan completed for scan ID: ${scan.id}`);

    res.status(200).json({
      success: true,
      message: 'Rescan completed successfully',
      scan_id: scan.id,
      risk_score: aiResult.risk_score,
      summary: aiResult.summary,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createScan,
  getScans,
  getScanById,
  rescan,
  scanValidation,
};