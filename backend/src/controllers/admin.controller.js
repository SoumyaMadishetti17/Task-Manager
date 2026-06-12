const User = require('../models/User.model');
const Task = require('../models/Task.model');
const ActivityLog = require('../models/ActivityLog.model');

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'Admin') return res.status(403).json({ message: 'Cannot delete admin' });

    await Task.deleteMany({ owner: user._id });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/tasks/:id
const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalTasks, completedTasks, pendingTasks, inProgressTasks] = await Promise.all([
      User.countDocuments({ role: 'User' }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'In Progress' }),
    ]);
    res.json({ totalUsers, totalTasks, completedTasks, pendingTasks, inProgressTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, deleteUser, updateUserStatus, getAllTasks, deleteAnyTask, getAnalytics };
