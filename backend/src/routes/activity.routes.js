const express = require('express');
const router = express.Router();
const {
  getAllActivityLogs,
  getMyActivityLogs,
} = require('../controllers/activity.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllActivityLogs);
router.get('/me', protect, getMyActivityLogs);

module.exports = router;