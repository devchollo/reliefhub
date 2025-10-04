const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes (require valid JWT)
const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Authorize certain roles (e.g., admin)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    next();
  };
};

module.exports = { protect, authorize };
