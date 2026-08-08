const express = require('express');
const router = express.Router();
const { handleAIChat } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, handleAIChat);

module.exports = router;
