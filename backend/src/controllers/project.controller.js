const { body } = require('express-validator');
const { Project, Scan, Vulnerability } = require('../models/index');
const { logActivity } = require('../services/activity.service');

// Validation rules
const projectValidation = [
  body('project_name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Project name must be between 2 and 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

// CREATE PROJECT
const createProject = async (req, res, next) => {
  try {
    const { project_name, description } = req.body;

    const project = await Project.create({
      user_id: req.user.id,
      project_name,
      description: description || null,
    });

    await logActivity(req.user.id, `Project created: ${project_name}`);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });

  } catch (error) {
    next(error);
  }
};

// GET ALL PROJECTS for logged in user
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });

  } catch (error) {
    next(error);
  }
};

// GET ONE PROJECT by id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [
        {
          model: Scan,
          as: 'Scans',
          attributes: ['id', 'scan_type', 'status', 'risk_score', 'scan_date'],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE PROJECT
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const { project_name, description } = req.body;

    await project.update({
      project_name: project_name || project.project_name,
      description: description !== undefined ? description : project.description,
    });

    await logActivity(req.user.id, `Project updated: ${project.project_name}`);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });

  } catch (error) {
    next(error);
  }
};

// DELETE PROJECT
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const projectName = project.project_name;
    await project.destroy();

    await logActivity(req.user.id, `Project deleted: ${projectName}`);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  projectValidation,
};