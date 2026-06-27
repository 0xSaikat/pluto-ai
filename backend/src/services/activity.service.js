const { ActivityLog } = require('../models/index');

const logActivity = async (userId, action) => {
  try {
    await ActivityLog.create({
      user_id: userId,
      action: action,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

module.exports = { logActivity };