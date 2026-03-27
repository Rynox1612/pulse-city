const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HospitalAdmin = require('../models/HospitalAdmin');
const env = require('../config/env');

/**
 * protect — JWT authentication middleware.
 *
 * Extracts a token from:
 *   1. Authorization header: "Bearer <token>"
 *   2. httpOnly cookie: "pulse_token"
 *
 * Verifies the token, fetches the real DB document, and attaches it
 * to req.user so all downstream controllers have full user context.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // ── 1. Try Authorization header ─────────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // ── 2. Fall back to httpOnly cookie ─────────────────────────────────────
    if (!token && req.cookies?.pulse_token) {
      token = req.cookies.pulse_token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated. No token provided.', data: {} });
    }

    // ── 3. Verify and decode token ───────────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      const msg = err.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid token. Please log in again.';
      return res.status(401).json({ success: false, message: msg, data: {} });
    }

    const { id, role } = decoded;

    // ── 4. Fetch the correct document based on role ──────────────────────────
    // Using .lean() for a plain JS object — lighter than a full Mongoose doc
    let user;
    if (role === 'hospital_admin') {
      user = await HospitalAdmin.findById(id).select('-password').lean();
    } else {
      user = await User.findById(id).select('-password').lean();
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.', data: {} });
    }

    // ── 5. Attach to request ─────────────────────────────────────────────────
    req.user = { ...user, id: user._id.toString(), role };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed.', data: {} });
  }
};

module.exports = { protect };
