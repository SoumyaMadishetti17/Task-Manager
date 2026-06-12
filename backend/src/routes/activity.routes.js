const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const ActivityLog = require('../models/ActivityLog.model');

// GET /api/activity — Admin sees all, User sees own
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { user: req.user._id };
    const logs = await ActivityLog.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
