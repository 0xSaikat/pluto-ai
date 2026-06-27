const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  projectValidation,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes protected
router.post('/', protect, projectValidation, validate, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, projectValidation, validate, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;