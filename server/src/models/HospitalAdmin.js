const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('../config/appConstants');

const hospitalAdminSchema = new mongoose.Schema({
  // Admins must be rigidly mapped securely to the hospital they rule
  hospitalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital',
    index: true 
  },
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true
  },
  password: { type: String, required: true },
  role: { type: String, default: ROLES.HOSPITAL_ADMIN }
}, { timestamps: true });

// Auth Hashing Layer 
hospitalAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Native password comparative method utilized during login flow later 
hospitalAdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('HospitalAdmin', hospitalAdminSchema);
