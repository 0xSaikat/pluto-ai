const sequelize = require('../config/database');

const User = require('./User');
const Project = require('./Project');
const Scan = require('./Scan');
const SourceCode = require('./SourceCode');
const Vulnerability = require('./Vulnerability');
const Report = require('./Report');
const ActivityLog = require('./ActivityLog');
const Feedback = require('./Feedback');

// User has many Projects
User.hasMany(Project, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'user_id' });

// Project has many Scans
Project.hasMany(Scan, { foreignKey: 'project_id', as: 'Scans', onDelete: 'CASCADE' });
Scan.belongsTo(Project, { foreignKey: 'project_id' });

// Scan has one SourceCode
Scan.hasOne(SourceCode, { foreignKey: 'scan_id', onDelete: 'CASCADE' });
SourceCode.belongsTo(Scan, { foreignKey: 'scan_id' });

// Scan has many Vulnerabilities
Scan.hasMany(Vulnerability, { foreignKey: 'scan_id', onDelete: 'CASCADE' });
Vulnerability.belongsTo(Scan, { foreignKey: 'scan_id' });

// Scan has one Report
Scan.hasOne(Report, { foreignKey: 'scan_id', onDelete: 'CASCADE' });
Report.belongsTo(Scan, { foreignKey: 'scan_id' });

// User has many ActivityLogs
User.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

// User has many Feedback
User.hasMany(Feedback, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

// Report has many Feedback
Report.hasMany(Feedback, { foreignKey: 'report_id', onDelete: 'CASCADE' });
Feedback.belongsTo(Report, { foreignKey: 'report_id' });

module.exports = {
  sequelize,
  User,
  Project,
  Scan,
  SourceCode,
  Vulnerability,
  Report,
  ActivityLog,
  Feedback,
};