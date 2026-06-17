require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const Task = require("../backend/models/Task");

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    cachedConnection = connection;
    console.log("MongoDB connected");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  try {
    await connectToDatabase();

    // GET /api/roadmaps
    if (req.method === "GET") {
      const goals = await Task.distinct("goal");

      const roadmaps = [];

      for (const goal of goals) {
        const tasks = await Task.find({ goal });

        const totalTasks = tasks.length;

        const completedTasks = tasks.filter((task) => task.completed).length;

        const progress =
          totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        roadmaps.push({
          goal,
          totalTasks,
          completedTasks,
          progress,
        });
      }

      return res.status(200).json({
        success: true,
        data: roadmaps,
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
