const Project = require("../models/Project");
const Task = require("../models/Task");

const getProjectMetrics = async (projectId) => {
  const tasks = await Task.find({ project: projectId });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks: totalTasks - completedTasks,
    progress,
  };
};

const decorateProjects = async (projects) =>
  Promise.all(
    projects.map(async (project) => ({
      ...project.toObject(),
      metrics: await getProjectMetrics(project._id),
    }))
  );

const getProjects = async (req, res, next) => {
  try {
    const { search = "", status } = req.query;
    const query = {
      owner: req.user._id,
      title: { $regex: search, $options: "i" },
    };

    if (status && status !== "All") {
      query.status = status;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    const data = await decorateProjects(projects);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const tasks = await Task.find({ project: project._id }).populate("assignedTo", "name email");
    const metrics = await getProjectMetrics(project._id);

    res.json({
      ...project.toObject(),
      tasks,
      metrics,
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description, startDate, deadline, status } = req.body;

    if (!title || !startDate || !deadline) {
      res.status(400);
      throw new Error("Title, start date, and deadline are required");
    }

    const project = await Project.create({
      title,
      description,
      startDate,
      deadline,
      status,
      owner: req.user._id,
    });

    res.status(201).json({
      ...project.toObject(),
      metrics: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, progress: 0 },
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const fields = ["title", "description", "startDate", "deadline", "status"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    const updatedProject = await project.save();
    const metrics = await getProjectMetrics(updatedProject._id);

    res.json({
      ...updatedProject.toObject(),
      metrics,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

const getDashboardSummary = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user._id });
    const projectIds = projects.map((project) => project._id);
    const tasks = await Task.find({ project: { $in: projectIds } }).sort({ deadline: 1 });
    const now = new Date();

    const completedTasks = tasks.filter((task) => task.status === "Done").length;
    const pendingTasks = tasks.filter((task) => task.status !== "Done").length;
    const overdueTasks = tasks.filter(
      (task) => task.status !== "Done" && new Date(task.deadline) < now
    );
    const upcomingDeadlines = tasks
      .filter((task) => task.status !== "Done" && new Date(task.deadline) >= now)
      .slice(0, 5);

    res.json({
      totals: {
        totalProjects: projects.length,
        completedTasks,
        pendingTasks,
        overdueTasks: overdueTasks.length,
      },
      upcomingDeadlines,
      recentProjects: await decorateProjects(projects.slice(0, 4)),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getDashboardSummary,
};

