const mongoose = require('mongoose');
const { SEVERITY_LEVELS } = require('../config/appConstants');

const aiChatLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true 
  },
  symptoms: { type: String, required: true, trim: true },
  chatbotResponse: { type: String, required: true },
  urgencyLevel: { 
    type: String, 
    enum: Object.values(SEVERITY_LEVELS),
    default: SEVERITY_LEVELS.LOW 
  },
  // Relationship linking AI feedback explicitly recommending a location
  recommendedHospital: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital' 
  }
}, { timestamps: true });

module.exports = mongoose.model('AIChatLog', aiChatLogSchema);
