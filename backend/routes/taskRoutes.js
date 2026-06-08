const express = require("express");
const router = express.Router();
console.log("taskRoutes loaded");

// controller function (we will create next)

const {
  getTasks,
  createTask,
  updateTask
} = require("../controllers/taskController");

// GET all tasks
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);


module.exports = router;