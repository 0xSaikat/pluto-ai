const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getReportFeedback,
} = require('../controllers/feedback.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, submitFeedback);
router.get('/report/:reportId', protect, getReportFeedback);

module.exports = router;
