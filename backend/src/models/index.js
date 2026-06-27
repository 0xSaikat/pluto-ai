const sequelize = require('../config/database');

const User = require('./User');
const Project = require('./Project');
const Scan = require('./Scan');
const SourceCode = require('./SourceCode');
const Vulnerability = require('./Vulnerability');
const Report = require('./Report');
const ActivityLog = require('./ActivityLog');
const Feedback = require('./Feedback');

// User → Project
User.hasMany(Project, {
  foreignKey: 'user_id',
  as: 'Projects',
  onDelete: 'CASCADE',
});
Project.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// Project → Scan
Project.hasMany(Scan, {
  foreignKey: 'project_id',
  as: 'Scans',
  onDelete: 'CASCADE',
});
Scan.belongsTo(Project, { foreignKey: 'project_id', as: 'Project' });

// Scan → SourceCode
Scan.hasOne(SourceCode, {
  foreignKey: 'scan_id',
  as: 'SourceCode',
  onDelete: 'CASCADE',
});
SourceCode.belongsTo(Scan, { foreignKey: 'scan_id', as: 'Scan' });

// Scan → Vulnerability
Scan.hasMany(Vulnerability, {
  foreignKey: 'scan_id',
  as: 'Vulnerabilities',
  onDelete: 'CASCADE',
});
Vulnerability.belongsTo(Scan, { foreignKey: 'scan_id', as: 'Scan' });

// Scan → Report
Scan.hasOne(Report, {
  foreignKey: 'scan_id',
  as: 'Report',
  onDelete: 'CASCADE',
});
Report.belongsTo(Scan, { foreignKey: 'scan_id', as: 'Scan' });

// User → ActivityLog
User.hasMany(ActivityLog, {
  foreignKey: 'user_id',
  as: 'ActivityLogs',
  onDelete: 'CASCADE',
});
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// User → Feedback
User.hasMany(Feedback, {
  foreignKey: 'user_id',
  as: 'Feedbacks',
  onDelete: 'CASCADE',
});
Feedback.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// Report → Feedback
Report.hasMany(Feedback, {
  foreignKey: 'report_id',
  as: 'Feedbacks',
  onDelete: 'CASCADE',
});
Feedback.belongsTo(Report, { foreignKey: 'report_id', as: 'Report' });

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