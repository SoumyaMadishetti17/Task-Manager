const Task = require('../models/Task.model');
const ActivityLog = require('../models/ActivityLog.model');

// GET /api/tasks — user sees only own tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      owner: req.user._id,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'TASK_CREATED',
      details: `Created task: "${title}"`,
      meta: { taskId: task._id },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, priority, dueDate } = req.body;
    Object.assign(task, { title, description, status, priority, dueDate });
    await task.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'TASK_UPDATED',
      details: `Updated task: "${task.title}"`,
      meta: { taskId: task._id },
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const title = task.title;
    await task.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      action: 'TASK_DELETED',
      details: `Deleted task: "${title}"`,
      meta: { taskId: req.params.id },
    });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
