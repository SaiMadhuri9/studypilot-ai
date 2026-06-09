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

const getTasks = (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

const createTask = (req, res) => {
  const { title } = req.body;

  const newTask = {
    id: 3,
    title,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask
  });
};

const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);

  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  res.status(200).json({
    success: true,
    data: deletedTask[0]
  });
};

const updateTask = (req, res) => {
  const id = parseInt(req.params.id);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    task.title = title;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  res.json({
    success: true,
    data: task
  });
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

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  generateStudyPlan,
};