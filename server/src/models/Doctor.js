const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  // Relationship securely associating them with one exact Hospital
  hospitalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true,
    index: true 
  },
  availabilityStatus: { 
    type: String, 
    enum: ['available', 'in_surgery', 'off_duty'], 
    default: 'available' 
  },
  shiftStart: { type: String }, // e.g. "09:00 AM"
  shiftEnd: { type: String },   // e.g. "05:00 PM"
  contactInfo: {
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
