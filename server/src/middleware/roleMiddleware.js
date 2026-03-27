/**
 * authorizeRoles — role-based authorization middleware (factory pattern).
 *
 * Usage in routes:
 *   router.put('/endpoint', protect, authorizeRoles('hospital_admin'), handler)
 *
 * Must be used AFTER the protect middleware because it relies on req.user.role
 * being already populated.
 *
 * @param {...string} roles - One or more allowed roles
 * @returns Express middleware function
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.', data: {} });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of the following roles: [${roles.join(', ')}]. Your role: ${req.user.role}.`,
        data: {},
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
