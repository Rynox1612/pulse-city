const mongoose = require('mongoose');
const { HOSPITAL_TYPES } = require('../config/appConstants');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true, index: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  specialties: [{ type: String, trim: true, index: true }], // Indexed for fast filtering
  emergencyAvailable: { type: Boolean, default: true },
  
  // Real-time capacity monitoring fields
  icuBeds: { type: Number, default: 0 },
  erBeds: { type: Number, default: 0 },
  generalBeds: { type: Number, default: 0 },
  ventilators: { type: Number, default: 0 },
  ambulanceAvailable: { type: Boolean, default: false },
  
  contactNumber: { type: String, required: true, trim: true },
  is24x7: { type: Boolean, default: true },
  hospitalType: { 
    type: String, 
    enum: Object.values(HOSPITAL_TYPES), 
    default: HOSPITAL_TYPES.GENERAL 
  },
  // Relationship to the Admin who runs this listing
  createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalAdmin' }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
