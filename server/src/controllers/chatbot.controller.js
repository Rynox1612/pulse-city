const AIChatLog = require('../models/AIChatLog');
const asyncHandler = require('../utils/asyncHandler');
const { analyzeSymptomText, DISCLAIMER } = require('../utils/symptomAnalyzer');

// ─── Analyze Symptoms ─────────────────────────────────────────────────────────
// POST /api/chatbot/analyze
const analyzeSymptoms = asyncHandler(async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) return res.status(400).json({ success: false, message: 'Symptoms are required.', data: {} });

  const { urgencyLevel, guidance, action } = analyzeSymptomText(symptoms);

  const responseText = `${guidance}\n\n${DISCLAIMER}`;

  // Persist the interaction if user is authenticated
  if (req.user?.id) {
    await AIChatLog.create({
      userId: req.user.id,
      symptoms,
      chatbotResponse: responseText,
      urgencyLevel,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Symptom analysis complete.',
    data: { urgencyLevel, guidance: responseText, action, disclaimer: DISCLAIMER },
  });
});

// ─── Chat With Assistant ──────────────────────────────────────────────────────
// POST /api/chatbot/chat
const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message is required.', data: {} });

  const { urgencyLevel, guidance, action } = analyzeSymptomText(message);
  const responseText = `${guidance}\n\n${DISCLAIMER}`;

  if (req.user?.id) {
    await AIChatLog.create({
      userId: req.user.id,
      symptoms: message,
      chatbotResponse: responseText,
      urgencyLevel,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Assistant response generated.',
    data: { reply: responseText, urgencyLevel, action },
  });
});

// ─── Get Chat History ─────────────────────────────────────────────────────────
// GET /api/chatbot/history
const getChatHistory = asyncHandler(async (req, res) => {
  const logs = await AIChatLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: 'Chat history fetched.', data: logs });
});

// ─── Get Chat By ID ───────────────────────────────────────────────────────────
// GET /api/chatbot/history/:id
const getChatById = asyncHandler(async (req, res) => {
  const log = await AIChatLog.findOne({ _id: req.params.id, userId: req.user.id });
  if (!log) return res.status(404).json({ success: false, message: 'Chat log not found.', data: {} });
  res.status(200).json({ success: true, message: 'Chat log fetched.', data: log });
});

// ─── Delete Chat ──────────────────────────────────────────────────────────────
// DELETE /api/chatbot/history/:id
const deleteChatById = asyncHandler(async (req, res) => {
  const log = await AIChatLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!log) return res.status(404).json({ success: false, message: 'Chat log not found.', data: {} });
  res.status(200).json({ success: true, message: 'Chat log deleted.', data: {} });
});

module.exports = { analyzeSymptoms, chatWithAssistant, getChatHistory, getChatById, deleteChatById };
