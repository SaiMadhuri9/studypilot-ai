const Task = require("../models/Task");

const tasks = [
  {
    id: 1,
    title: "Learn Node.js",
    completed: false,
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Build StudyPilot AI",
    completed: false,
    createdAt: new Date()
  }
];

const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
  filter.title = {
    $regex: req.query.search,
    $options: "i",
  };
}
    if (req.query.completed === "true") {
  filter.completed = true;
}

if (req.query.completed === "false") {
  filter.completed = false;
}
if (req.query.goal) {
  filter.goal = {
    $regex: req.query.goal,
    $options: "i"
  };
}
    const tasks = await Task.find(filter);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createTask = async (req, res) => {
  try {

    const { title, goal } = req.body;

    const newTask = await Task.create({
      title,
      goal
    });

    res.status(201).json({
      success: true,
      data: newTask,
    });

  } catch (error) {

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteTask = async (req, res) => {
  try {

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });

  } catch (error) {

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const getGoals = async (req, res) => {
  try {

    const goals = await Task.distinct("goal");

    res.status(200).json({
      success: true,
      data: goals
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const getRoadmaps = async (req, res) => {
  try {

    const goals = await Task.distinct("goal");
    const filteredGoals =
goals.filter(
 goal => goal !== "General"
);

    const roadmaps = [];

    for (const goal of filteredGoals) {

      const tasks = await Task.find({ goal });

      const totalTasks = tasks.length;

      const completedTasks =
        tasks.filter(task => task.completed).length;

      const progress =
        totalTasks === 0
          ? 0
          : Math.round(
              (completedTasks / totalTasks) * 100
            );

      roadmaps.push({
        goal,
        totalTasks,
        completedTasks,
        progress
      });

    }

    res.status(200).json({
      success: true,
      data: roadmaps
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const deleteRoadmap = async (req, res) => {
  try {

    await Task.deleteMany({
      goal: req.params.goal
    });

    res.status(200).json({
      success: true,
      message: "Roadmap deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  getTasks,
  getGoals,
  getRoadmaps,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteRoadmap
};