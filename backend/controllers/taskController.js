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
    const { title } = req.body;

    const newTask = await Task.create({
      title,
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

const generateStudyPlan = (req, res) => {
  const { subject, daysLeft, hoursPerDay } = req.body;

  if (!subject || !daysLeft || !hoursPerDay) {
    return res.status(400).json({
      success: false,
      message: "Please provide subject, daysLeft and hoursPerDay"
    });
  }

  if (daysLeft <= 0 || hoursPerDay <= 0) {
    return res.status(400).json({
      success: false,
      message: "daysLeft and hoursPerDay must be greater than 0"
    });
  }

  const totalHours = daysLeft * hoursPerDay;

  let topics = [];

  if (subject.toLowerCase() === "javascript") {
    topics = [
      "Variables",
      "Functions",
      "Arrays",
      "Objects",
      "DOM"
    ];
  } else if (subject.toLowerCase() === "nodejs") {
    topics = [
      "Modules",
      "Express",
      "Routes",
      "Controllers",
      "MongoDB"
    ];
  } else {
    topics = [
      "Introduction",
      "Basics",
      "Practice",
      "Revision",
      "Mock Test"
    ];
  }

  const plan = [];

  for (let i = 0; i < daysLeft; i++) {
    const topic = topics[i % topics.length];

    plan.push(
  `Day ${i + 1} - ${topic} (${hoursPerDay} hours)`
);
  }
  const generatedAt = new Date();

res.json({
  success: true,
  subject,
  totalDays: daysLeft,
  totalHours,
  dailyHours: hoursPerDay,
  generatedAt,
  dailyPlan: plan
});
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


module.exports = {
  getTasks,
  getGoals,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  generateStudyPlan,
};