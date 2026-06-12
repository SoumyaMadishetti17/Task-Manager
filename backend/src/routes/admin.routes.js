const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
  getAnalytics,
} = require('../controllers/admin.controller');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);

router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteAnyTask);

router.get('/analytics', getAnalytics);

module.exports = router;
