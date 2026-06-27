const express = require('express');
const router = express.Router();
const {
  getReports,
  getReportById,
  downloadReport,
} = require('../controllers/report.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getReports);
router.get('/:id', protect, getReportById);
router.get('/:id/download', protect, downloadReport);

module.exports = router;