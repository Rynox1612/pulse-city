const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const hospitalRoutes = require('./hospital.routes');
const doctorRoutes = require('./doctor.routes');
const availabilityRoutes = require('./availability.routes');
const emergencyRoutes = require('./emergency.routes');
const chatbotRoutes = require('./chatbot.routes');
const adminRoutes = require('./admin.routes');
const dashboardRoutes = require('./dashboard.routes');

// Health check — useful for uptime monitoring and deployment verification
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Pulse City API is running', data: {} });
});

// Mount all route groups under their respective paths
router.use('/auth', authRoutes);           // /api/auth/*
router.use('/users', userRoutes);          // /api/users/*
router.use('/hospitals', hospitalRoutes);  // /api/hospitals/*
router.use('/doctors', doctorRoutes);      // /api/doctors/*
router.use('/availability', availabilityRoutes); // /api/availability/*
router.use('/emergency', emergencyRoutes); // /api/emergency/*
router.use('/chatbot', chatbotRoutes);     // /api/chatbot/*
router.use('/admin', adminRoutes);         // /api/admin/*
router.use('/dashboard', dashboardRoutes); // /api/dashboard/*

module.exports = router;
