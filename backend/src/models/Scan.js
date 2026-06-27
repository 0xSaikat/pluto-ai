const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scan = sequelize.define('Scan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  scan_type: {
    type: DataTypes.ENUM('paste', 'upload', 'github'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Scan type cannot be empty' },
    },
  },
  scan_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('pending', 'running', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  risk_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Risk score cannot be less than 0' },
      max: { args: [100], msg: 'Risk score cannot be more than 100' },
    },
  },
}, {
  tableName: 'scans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Scan;