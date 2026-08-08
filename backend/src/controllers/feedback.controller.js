const { Feedback, Report, Scan, Project } = require('../models/index');

// SUBMIT FEEDBACK for a report
const submitFeedback = async (req, res, next) => {
  try {
    const { report_id, rating, comments } = req.body;

    if (!report_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Report ID and rating (1-5) are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
      });
    }

    const report = await Report.findOne({
      where: { id: report_id },
      include: [
        {
          model: Scan,
          as: 'Scan',
          include: [
            {
              model: Project,
              as: 'Project',
              where: { user_id: req.user.id },
            },
          ],
        },
      ],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const feedback = await Feedback.create({
      user_id: req.user.id,
      report_id,
      rating,
      comments: comments || null,
      created_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// GET FEEDBACK FOR REPORT
const getReportFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { report_id: req.params.reportId },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getReportFeedback,
};
