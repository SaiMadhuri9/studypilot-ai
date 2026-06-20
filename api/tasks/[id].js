require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const Task = require("../../backend/models/Task");

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(
    process.env.MONGO_URI
  );

  cachedConnection = connection;
  return connection;
}

module.exports = async (req, res) => {
  try {
    await connectToDatabase();

    const { id } = req.query;

    // GET task by ID
    if (req.method === "GET") {
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: task
      });
    }

    // UPDATE task
    if (req.method === "PUT") {
      const task = await Task.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: task
      });
    }

    // DELETE task
    if (req.method === "DELETE") {
      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: task
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};