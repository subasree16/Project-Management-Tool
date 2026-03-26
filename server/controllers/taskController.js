const Project = require("../models/Project");
const Task = require("../models/Task");

const ensureProjectOwnership = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

const createTask = async (req, res, next) => {
  try {
    const project = await ensureProjectOwnership(req.params.projectId, req.user._id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const { title, description, priority, deadline, status, assignedTo } = req.body;
    if (!title || !deadline) {
      res.status(400);
      throw new Error("Title and deadline are required");
    }

    const task = await Task.create({
      project: project._id,
      title,
      description,
      priority,
      deadline,
      status,
      assignedTo: assignedTo || req.user._id,
    });

    const populatedTask = await task.populate("assignedTo", "name email");
    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const project = await ensureProjectOwnership(task.project, req.user._id);
    if (!project) {
      res.status(403);
      throw new Error("Not allowed to update this task");
    }

    const fields = ["title", "description", "priority", "deadline", "status", "assignedTo"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    const populatedTask = await task.populate("assignedTo", "name email");
    res.json(populatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const project = await ensureProjectOwnership(task.project, req.user._id);
    if (!project) {
      res.status(403);
      throw new Error("Not allowed to delete this task");
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};

