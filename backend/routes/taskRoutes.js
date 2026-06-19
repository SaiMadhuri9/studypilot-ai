const express = require("express");
const router = express.Router();
console.log("taskRoutes loaded");

// controller function (we will create next)

const {
  getTasks,
  getGoals,
  getRoadmaps,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteRoadmap,
} = require("../controllers/taskController");
const {
  generateStudyPlan
} = require("../controllers/studyPlanController");

router.get("/", getTasks);
router.get("/goals", getGoals);
router.get("/roadmaps", getRoadmaps);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.post("/study-plan", generateStudyPlan);
router.delete(
  "/roadmaps/:goal",
  deleteRoadmap
);


router.route("/:id")
  .put(updateTask)
  .delete(deleteTask);



module.exports = router;