const express = require("express");
const router = express.Router();
console.log("taskRoutes loaded");

// controller function (we will create next)

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");



router.get("/", getTasks);
router.post("/", createTask);


router.route("/:id")
  .put(updateTask)
  .delete(deleteTask);



module.exports = router;