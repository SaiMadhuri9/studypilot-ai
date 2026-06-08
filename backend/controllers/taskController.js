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

module.exports = {
  getTasks,
  createTask,
  updateTask
};