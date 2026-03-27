const express = require('express');
const router = express.Router();
const {
  getAdminProfile, updateAdminProfile,
  getAdminHospital, updateAdminHospital,
  getAdminEmergencyRequests, getAdminAnalytics
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All admin routes require hospital_admin role — apply globally
router.use(protect, authorizeRoles('hospital_admin'));

// GET /api/admin/profile — Admin's own profile
// PUT /api/admin/profile — Update admin profile name
router.route('/profile')
  .get(getAdminProfile)
  .put(updateAdminProfile);

// GET /api/admin/hospital — Admin's linked hospital details
// PUT /api/admin/hospital — Update hospital profile data
router.route('/hospital')
  .get(getAdminHospital)
  .put(updateAdminHospital);

// GET /api/admin/emergency-requests — Incoming requests for this hospital
router.get('/emergency-requests', getAdminEmergencyRequests);

// GET /api/admin/analytics — Stats overview for admin dashboard
router.get('/analytics', getAdminAnalytics);

module.exports = router;
