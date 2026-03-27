const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile,
  getMedicalInfo, updateMedicalInfo,
  getSavedHospitals, saveHospital, removeSavedHospital
} = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

// All user routes require authentication — apply protect globally for this router
router.use(protect);

// GET /api/users/profile  — Fetch user profile
// PUT /api/users/profile  — Update user profile
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

// GET /api/users/medical-info — View medical details
// PUT /api/users/medical-info — Update medical details
router.route('/medical-info')
  .get(getMedicalInfo)
  .put(updateMedicalInfo);

// GET /api/users/saved-hospitals — List saved hospitals
router.get('/saved-hospitals', getSavedHospitals);

// POST   /api/users/saved-hospitals/:hospitalId — Add to saved
// DELETE /api/users/saved-hospitals/:hospitalId — Remove from saved
router.route('/saved-hospitals/:hospitalId')
  .post(saveHospital)
  .delete(removeSavedHospital);

module.exports = router;
