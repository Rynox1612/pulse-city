const express = require('express');
const router = express.Router();
const { analyzeSymptoms, chatWithAssistant, getChatHistory, getChatById, deleteChatById } = require('../controllers/chatbot.controller');
const { protect } = require('../middleware/authMiddleware');

// POST /api/chatbot/analyze — public (works unauthenticated, won't save to DB)
router.post('/analyze', analyzeSymptoms);

// POST /api/chatbot/chat — public or authenticated (saves to DB if logged in)
router.post('/chat', chatWithAssistant);

// GET  /api/chatbot/history — must be logged in to view history
router.get('/history', protect, getChatHistory);

// GET    /api/chatbot/history/:id — owner only
// DELETE /api/chatbot/history/:id — owner only
router.route('/history/:id')
  .get(protect, getChatById)
  .delete(protect, deleteChatById);

module.exports = router;
