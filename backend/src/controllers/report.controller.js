const { Report, Scan, Project, Vulnerability } = require('../models/index');
const { generateReport } = require('../services/report.service');
const { logActivity } = require('../services/activity.service');

// GET ALL REPORTS for logged in user
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Scan,
          as: 'Scan',
          attributes: ['id', 'scan_type', 'status', 'risk_score', 'scan_date'],
          include: [
            {
              model: Project,
              as: 'Project',
              where: { user_id: req.user.id },
              attributes: ['project_name'],
            },
          ],
        },
      ],
      order: [['generated_date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {
    next(error);
  }
};

// GET ONE REPORT by id
const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Scan,
          as: 'Scan',
          attributes: ['id', 'scan_type', 'status', 'risk_score', 'scan_date'],
          include: [
            {
              model: Project,
              as: 'Project',
              where: { user_id: req.user.id },
              attributes: ['project_name'],
            },
            {
              model: Vulnerability,
              as: 'Vulnerabilities',
            },
          ],
        },
      ],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    await logActivity(req.user.id, `Report viewed: Report ID ${report.id}`);

    res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {
    next(error);
  }
};

// DOWNLOAD REPORT as JSON
const downloadReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Scan,
          as: 'Scan',
          include: [
            {
              model: Project,
              as: 'Project',
              where: { user_id: req.user.id },
            },
          ],
        },
      ],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    await logActivity(
      req.user.id,
      `Report downloaded: Report ID ${report.id}`
    );

    // Send as downloadable JSON file
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report_${report.id}.json"`
    );

    res.status(200).json(report.report_data);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
  getReportById,
  downloadReport,
};