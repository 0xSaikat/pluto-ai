const { ActivityLog, User } = require('../models/index');

// GET ALL ACTIVITY LOGS — admin only
const getAllActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
      order: [['timestamp', 'DESC']],
      limit: 100,
    });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });

  } catch (error) {
    next(error);
  }
};

// GET CURRENT USER ACTIVITY LOGS
const getMyActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { user_id: req.user.id },
      order: [['timestamp', 'DESC']],
      limit: 50,
    });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllActivityLogs,
  getMyActivityLogs,
};