const User = require('../models/User');
const HospitalAdmin = require('../models/HospitalAdmin');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken, sendTokenCookie } = require('../utils/jwtHelper');

// ─── Register User ────────────────────────────────────────────────────────────
// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, age, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.', data: {} });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.', data: {} });
  }

  const user = await User.create({ name, email, phone, password, age, gender });
  const token = generateToken(user._id, user.role);

  sendTokenCookie(res, token, 201, 'Account created successfully.', {
    id: user._id, name: user.name, email: user.email, role: user.role,
  });
});

// ─── Login User ───────────────────────────────────────────────────────────────
// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.', data: {} });
  }

  // select('+password') because password field has select:false by default in production — consistent practice
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.', data: {} });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.', data: {} });
  }

  const token = generateToken(user._id, user.role);
  sendTokenCookie(res, token, 200, 'Login successful.', {
    id: user._id, name: user.name, email: user.email, role: user.role,
  });
});

// ─── Admin Login ──────────────────────────────────────────────────────────────
// POST /api/auth/admin/login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.', data: {} });
  }

  const admin = await HospitalAdmin.findOne({ email }).populate('hospitalId', 'name city');
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials.', data: {} });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials.', data: {} });
  }

  const token = generateToken(admin._id, admin.role);
  sendTokenCookie(res, token, 200, 'Admin login successful.', {
    id: admin._id, name: admin.name, email: admin.email, role: admin.role,
    hospital: admin.hospitalId,
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('pulse_token');
  res.status(200).json({ success: true, message: 'Logged out successfully.', data: {} });
});

// ─── Get Current User ─────────────────────────────────────────────────────────
// GET /api/auth/me  (protected — req.user set by auth middleware in Phase 9)
const getMe = asyncHandler(async (req, res) => {
  // req.user.id will be set by the protect middleware (Phase 9)
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated.', data: {} });
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    // Check admin table as fallback
    const admin = await HospitalAdmin.findById(userId).select('-password').populate('hospitalId', 'name city');
    if (!admin) return res.status(404).json({ success: false, message: 'User not found.', data: {} });
    return res.status(200).json({ success: true, message: 'Admin profile fetched.', data: admin });
  }

  res.status(200).json({ success: true, message: 'User profile fetched.', data: user });
});

module.exports = { register, login, adminLogin, logout, getMe };
