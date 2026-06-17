require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const Task = require("../backend/models/Task");

// Database connection helper
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

// CORS headers
const headers = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  "Content-Type": "application/json",
};

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  try {
    await connectToDatabase();

    const { id } = req.query;

    // GET /api/tasks/:id
    if (req.method === "GET" && id) {
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: task,
      });
    }

    // GET /api/tasks
    if (req.method === "GET") {
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
          $options: "i",
        };
      }

      const tasks = await Task.find(filter);

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    }

    // POST /api/tasks
    if (req.method === "POST" && !req.query.action) {
      const { title, goal } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      const newTask = await Task.create({
        title,
        goal: goal || "",
      });

      return res.status(201).json({
        success: true,
        data: newTask,
      });
    }

    // PUT /api/tasks/:id
    if (req.method === "PUT" && id) {
      const task = await Task.findByIdAndUpdate(req.params?.id || id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: task,
      });
    }

    // DELETE /api/tasks/:id
    if (req.method === "DELETE" && id) {
      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: task,
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
