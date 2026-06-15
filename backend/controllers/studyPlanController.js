
console.log("STUDY PLAN CONTROLLER LOADED");
const Task = require("../models/Task");
const roadmaps = require("../data/roadmaps");
const goalMappings = require("../data/goalMappings");
const aliases = require("../data/aliases");
const generateCustomRoadmap =
require("../data/customRoadmaps");
const generateStudyPlan = async (req, res) => {
    
  try {
    const goal = req.body.goal;
    const days = req.body.days;

    if (!goal) {
      return res.status(400).json({
        success: false,
        message: "Goal is required"
      });
    }
    if (!days) {
  return res.status(400).json({
    success: false,
    message: "Days is required"
  });
}

const userGoal = goal.toLowerCase();

let plan = [];

for (const key of Object.keys(goalMappings)) {

  if (userGoal.includes(key)) {

    plan = goalMappings[key];

    break;

  }

}

for (const roadmapKey of Object.keys(aliases)) {

  if (plan.length > 0) {
    break;
  }

  for (const alias of aliases[roadmapKey]) {

    if (userGoal.includes(alias)) {

      plan = goalMappings[roadmapKey];

      break;

    }

  }

}



if (plan.length === 0) {
  const customPlan =
    generateCustomRoadmap(goal);

  if (customPlan) {
    plan = customPlan;
  }
}

if (plan.length === 0) {

  return res.status(400).json({
    success: false,
    message: "Goal not supported",
    suggestions: [
      "JavaScript",
      "HTML",
      "Python",
      "React",
      "Java",
      "DSA",
      "Full Stack Developer"
    ]
  });

}


//     await Task.deleteMany({
//   isGenerated: true
// });
   const topicsPerDay = Math.ceil(plan.length / days);
   

   const studyDaysNeeded =
  Math.ceil(plan.length / topicsPerDay);

const remainingDays =
  days - studyDaysNeeded;

  let extraTasks = [];

for (let i = 1; i <= remainingDays; i++) {

  if (i === remainingDays) {
    extraTasks.push("Final Review");
  }
  else if (i === remainingDays - 1) {
    extraTasks.push("Mock Test");
  }
  else {
    extraTasks.push("Revision");
  }

}




   console.log("Remaining Days:", remainingDays);

let difficulty = "";

if (topicsPerDay <= 3) {
  difficulty = "easy";
} else if (topicsPerDay <= 5) {
  difficulty = "moderate";
} else if (topicsPerDay <= 8) {
  difficulty = "intensive";
} else {
  difficulty = "extreme";
}

const estimatedHoursPerDay =
(
  topicsPerDay *
  getEstimatedHours(difficulty)
).toFixed(1);
let warning = "";

if (
  difficulty === "intensive" ||
  difficulty === "extreme"
) {
  warning =
    "This roadmap may be difficult to complete. Consider increasing the number of days.";
}


let currentTopicIndex = 0;
function getTaskDifficulty(topic) {

  if (
    topic.includes("Basics") ||
    topic.includes("Variables") ||
    topic.includes("Data Types") ||
    topic.includes("Operators")
  ) {
    return "easy";
  }

  if (
  topic.includes("Conditionals") ||
  topic.includes("Loops") ||
  topic.includes("Functions") ||
  topic.includes("Arrays") ||
  topic.includes("Objects") ||
  topic.includes("Array Methods") ||
  topic.includes("Object Methods") ||
  topic.includes("Error Handling") ||
   topic.includes("Components") ||
  topic.includes("JSX") ||
  topic.includes("Props") ||
  topic.includes("State") ||
  topic.includes("Forms") ||
  topic.includes("Routing")
) {
  return "moderate";
}

  if (
    topic.includes("DOM") ||
    topic.includes("Events") ||
    topic.includes("Fetch API") ||
    topic.includes("Promises") ||
    topic.includes("Async/Await") ||
    topic.includes("useEffect") ||
  topic.includes("API Calls") ||
  topic.includes("Context API")
  ) {
    return "intensive";
  }

  if (
    topic.includes("Mini Project")
  ) {
    return "extreme";
  }

  return "easy";
}

function getEstimatedHours(level) {

  if (level === "easy") {
    return 0.5;
  }

  if (level === "moderate") {
    return 1;
  }

  if (level === "intensive") {
    return 1.5;
  }

  if (level === "extreme") {
    return 2;
  }

  return 0.5;
}

for (let day = 1; day <= days; day++) {

  let dayTopics = [];

  for (let j = 0; j < topicsPerDay; j++) {

    if (currentTopicIndex < plan.length) {

      dayTopics.push(plan[currentTopicIndex]);

      currentTopicIndex++;

    }

  }

  if (dayTopics.length > 0) {
  const taskDifficulty =
  getTaskDifficulty(dayTopics.join(", "));

await Task.create({
  title: `Day ${day} - ${dayTopics.join(", ")}`,
  goal: goal,
  difficulty: taskDifficulty,
  isGenerated: true
});
}
else {

  const extraTaskIndex =
    day - (days - remainingDays) - 1;

 await Task.create({
  title: `Day ${day} - ${extraTasks[extraTaskIndex]}`,
  goal: goal,
  difficulty: "moderate",
  isGenerated: true
});
}

}

   res.status(200).json({
  success: true,
  plan,
  topicsPerDay,
  estimatedHoursPerDay,
  difficulty,
  warning
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





module.exports = {
  generateStudyPlan
};
// =========================
// FUTURE IMPROVEMENTS
// =========================

// 1. Expand JavaScript roadmap
// 2. Expand HTML roadmap
// 3. Expand Python roadmap
// 4. Add difficulty analyzer
// 5. Add warning system
// 6. Add revision days