const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SourceCode = sequelize.define('SourceCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  scan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'scans',
      key: 'id',
    },
  },
  source_type: {
    type: DataTypes.ENUM('paste', 'upload', 'github'),
    allowNull: false,
  },
  source_content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  github_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: 'Please provide a valid GitHub URL' },
    },
  },
}, {
  tableName: 'source_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SourceCode;