const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
} = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected route
router.get('/me', protect, getMe);

module.exports = router;