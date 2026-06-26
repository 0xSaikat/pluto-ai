const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const projectRoutes = require('./src/routes/project.routes');
const scanRoutes = require('./src/routes/scan.routes');
const vulnerabilityRoutes = require('./src/routes/vulnerability.routes');
const reportRoutes = require('./src/routes/report.routes');
const activityRoutes = require('./src/routes/activity.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Security
app.use(helmet());

// CORS — allows React frontend to call this backend
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging in terminal
app.use(morgan('dev'));

// Read JSON from request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — open this in browser to confirm server is running
app.get('/', (req, res) => {
  res.json({
    message: 'Pluto AI Backend is running',
    status: 'ok',
    version: '1.0.0',
  });
});

// All API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/activity-logs', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global error handler — must always be last
app.use(errorHandler);

module.exports = app;