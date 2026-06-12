const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Verify JWT and attach user to request
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.status === 'Inactive')
      return res.status(403).json({ message: 'Account is inactive' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

module.exports = { protect, adminOnly };
