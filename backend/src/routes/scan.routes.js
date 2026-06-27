const express = require('express');
const router = express.Router();
const {
  createScan,
  getScans,
  getScanById,
  rescan,
  scanValidation,
} = require('../controllers/scan.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', protect, scanValidation, validate, createScan);
router.get('/', protect, getScans);
router.get('/:id', protect, getScanById);
router.post('/:id/rescan', protect, rescan);

module.exports = router;