const express = require("express");
const router = express.Router();
console.log("taskRoutes loaded");

// controller function (we will create next)

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  generateStudyPlan,
} = require("../controllers/taskController");



router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.post("/study-plan", generateStudyPlan);


router.route("/:id")
  .put(updateTask)
  .delete(deleteTask);



module.exports = router;