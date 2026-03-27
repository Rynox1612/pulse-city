const User = require('../models/User');
const Hospital = require('../models/Hospital');
const asyncHandler = require('../utils/asyncHandler');

// ─── Get Profile ──────────────────────────────────────────────────────────────
// GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').populate('savedHospitals', 'name city contactNumber emergencyAvailable');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.', data: {} });
  res.status(200).json({ success: true, message: 'Profile fetched successfully.', data: user });
});

// ─── Update Profile ───────────────────────────────────────────────────────────
// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'age', 'gender', 'location'];
  const updates = {};
  allowedFields.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.', data: {} });
  res.status(200).json({ success: true, message: 'Profile updated successfully.', data: user });
});

// ─── Get Medical Info ─────────────────────────────────────────────────────────
// GET /api/users/medical-info
const getMedicalInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('bloodGroup allergies chronicDiseases emergencyContact');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.', data: {} });
  res.status(200).json({ success: true, message: 'Medical info fetched.', data: user });
});

// ─── Update Medical Info ──────────────────────────────────────────────────────
// PUT /api/users/medical-info
const updateMedicalInfo = asyncHandler(async (req, res) => {
  const { bloodGroup, allergies, chronicDiseases, emergencyContact } = req.body;
  const updates = {};
  if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
  if (allergies !== undefined) updates.allergies = allergies;
  if (chronicDiseases !== undefined) updates.chronicDiseases = chronicDiseases;
  if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('bloodGroup allergies chronicDiseases emergencyContact');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.', data: {} });
  res.status(200).json({ success: true, message: 'Medical info updated.', data: user });
});

// ─── Get Saved Hospitals ──────────────────────────────────────────────────────
// GET /api/users/saved-hospitals
const getSavedHospitals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedHospitals', 'name city address contactNumber emergencyAvailable icuBeds erBeds');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.', data: {} });
  res.status(200).json({ success: true, message: 'Saved hospitals fetched.', data: user.savedHospitals });
});

// ─── Save a Hospital ──────────────────────────────────────────────────────────
// POST /api/users/saved-hospitals/:hospitalId
const saveHospital = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;

  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.', data: {} });

  const user = await User.findById(req.user.id);
  if (user.savedHospitals.includes(hospitalId)) {
    return res.status(409).json({ success: false, message: 'Hospital already saved.', data: {} });
  }

  user.savedHospitals.push(hospitalId);
  await user.save();
  res.status(200).json({ success: true, message: 'Hospital saved successfully.', data: {} });
});

// ─── Remove a Saved Hospital ──────────────────────────────────────────────────
// DELETE /api/users/saved-hospitals/:hospitalId
const removeSavedHospital = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  await User.findByIdAndUpdate(req.user.id, { $pull: { savedHospitals: hospitalId } });
  res.status(200).json({ success: true, message: 'Hospital removed from saved list.', data: {} });
});

module.exports = { getProfile, updateProfile, getMedicalInfo, updateMedicalInfo, getSavedHospitals, saveHospital, removeSavedHospital };
