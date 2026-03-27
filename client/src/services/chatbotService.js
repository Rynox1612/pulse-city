import axiosInstance from '../api/axiosInstance';

/**
 * Chatbot Service — wraps all /api/chatbot/* endpoints.
 */

// Public endpoint (doesn't save to DB)
export const analyzeSymptoms = async (text) => {
  const res = await axiosInstance.post('/chatbot/analyze', { text });
  return res.data;
};

// Authenticated or public (saves to DB if user is logged in)
export const chatWithAssistant = async (text) => {
  const res = await axiosInstance.post('/chatbot/chat', { text });
  return res.data;
};

// Authed endpoints for history
export const getChatHistory = async () => {
  const res = await axiosInstance.get('/chatbot/history');
  return res.data;
};

export const getChatById = async (id) => {
  const res = await axiosInstance.get(`/chatbot/history/${id}`);
  return res.data;
};

export const deleteChatById = async (id) => {
  const res = await axiosInstance.delete(`/chatbot/history/${id}`);
  return res.data;
};
