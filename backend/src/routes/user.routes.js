const express = require('express');
const router = express.Router();
const { getAllUsers, getProfile } = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth');

// All user routes are protected
router.get('/', protect, adminOnly, getAllUsers);
router.get('/me', protect, getProfile);

module.exports = router;