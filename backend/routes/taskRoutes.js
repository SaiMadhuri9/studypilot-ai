const express = require("express");
const router = express.Router();
console.log("taskRoutes loaded");

// controller function (we will create next)
const { getTasks } = require("../controllers/taskController");

// GET all tasks
router.get("/", getTasks);

module.exports = router;