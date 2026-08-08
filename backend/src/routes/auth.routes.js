const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  registerValidation,
  loginValidation,
} = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/refresh-token', protect, refreshToken);
router.post('/logout', protect, logout);

module.exports = router;