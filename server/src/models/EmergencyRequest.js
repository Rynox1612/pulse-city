const mongoose = require('mongoose');
const { SEVERITY_LEVELS, REQUEST_STATUS } = require('../config/appConstants');

const emergencyRequestSchema = new mongoose.Schema({
  // Bidirectional Relationships linking the User who requested it and the Hospital answering it
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hospitalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true,
    index: true
  },
  symptoms: [{ type: String, trim: true }],
  severity: { 
    type: String, 
    enum: Object.values(SEVERITY_LEVELS), 
    default: SEVERITY_LEVELS.MEDIUM 
  },
  status: { 
    type: String, 
    enum: Object.values(REQUEST_STATUS), 
    default: REQUEST_STATUS.PENDING,
    index: true
  },
  liveLocation: {
    lat: { type: Number },
    lng: { type: Number },
    addressStr: { type: String }
  },
  requestedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
