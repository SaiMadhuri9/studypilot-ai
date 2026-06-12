console.log("STUDY PLAN CONTROLLER LOADED");
const Task = require("../models/Task");
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

    let plan = [];

    if (goal === "learn javascript") {
      plan = [
        "Basics",
        "Variables",
         "Data Types",
         "Operators",
         "Functions",
          "Arrays",
          "Objects",
          "DOM",
           "Events",
            "Mini Project"
      ];
    } 
    else if (goal === "learn html") {
      plan = [
        "learn basics",
        "learn span",
        "learn div",
        "learn full"
      ];
    } 
    else if (goal === "learn python") {
      plan = [
        "basics",
        "intro",
        "concepts",
        "final part"
      ];
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Goal not supported"
      });
    }
   const topicsPerDay = Math.ceil(plan.length / days);

let currentTopicIndex = 0;

for (let day = 1; day <= days; day++) {

  let dayTopics = [];

  for (let j = 0; j < topicsPerDay; j++) {

    if (currentTopicIndex < plan.length) {

      dayTopics.push(plan[currentTopicIndex]);

      currentTopicIndex++;

    }

  }

  await Task.create({
    title: `Day ${day} - ${dayTopics.join(", ")}`
  });

}

    res.status(200).json({
      success: true,
      plan
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