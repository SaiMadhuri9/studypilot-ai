const getTasks = (req, res) => {
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

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

module.exports = { getTasks }; 