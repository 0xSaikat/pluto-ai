const { chatWithAI } = require('../services/ai.service');

const handleAIChat = async (req, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const reply = await chatWithAI(message, context || {});

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleAIChat };
