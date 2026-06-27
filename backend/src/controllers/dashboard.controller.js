const { Scan, Project, Vulnerability, ActivityLog } = require('../models/index');

// GET DASHBOARD STATS
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all projects for this user
    const projects = await Project.findAll({
      where: { user_id: userId },
      attributes: ['id'],
    });

    const projectIds = projects.map((p) => p.id);

    // Total scans across all user projects
    const totalScans = await Scan.count({
      include: [
        {
          model: Project,
          as: 'Project',
          where: { user_id: userId },
          attributes: [],
        },
      ],
    });

    // Total threats found across all scans
    const threatsFound = await Vulnerability.count({
      include: [
        {
          model: Scan,
          as: 'Scan',
          attributes: [],
          include: [
            {
              model: Project,
              as: 'Project',
              where: { user_id: userId },
              attributes: [],
            },
          ],
        },
      ],
    });

    // Safe projects — projects where all scans have risk_score of 0
    // or projects with no vulnerabilities
    const allScans = await Scan.findAll({
      include: [
        {
          model: Project,
          as: 'Project',
          where: { user_id: userId },
          attributes: ['id'],
        },
      ],
      attributes: ['id', 'risk_score', 'status'],
    });

    // A project is safe if it has completed scans with risk score of 0
    const unsafeProjectIds = new Set(
      allScans
        .filter((s) => s.status === 'completed' && s.risk_score > 0)
        .map((s) => s.Project.id)
    );

    const safeProjects = projectIds.filter(
      (id) => !unsafeProjectIds.has(id)
    ).length;

    // Recent activity logs — last 10 actions
    const recentActivity = await ActivityLog.findAll({
      where: { user_id: userId },
      order: [['timestamp', 'DESC']],
      limit: 10,
      attributes: ['action', 'timestamp'],
    });

    res.status(200).json({
      success: true,
      dashboard: {
        total_scans: totalScans,
        threats_found: threatsFound,
        safe_projects: safeProjects,
        total_projects: projectIds.length,
        recent_activity: recentActivity.map((log) => ({
          action: log.action,
          timestamp: log.timestamp,
        })),
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };