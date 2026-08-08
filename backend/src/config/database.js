const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', '..', 'database', 'pluto.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? false : false,
});

module.exports = sequelize;