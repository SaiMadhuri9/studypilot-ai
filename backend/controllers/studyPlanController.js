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
      plan =[
  "Basics",
  "Variables",
  "Data Types",
  "Operators",
  "Conditionals",
  "Loops",
  "Functions",
  "Arrays",
  "Array Methods",
  "Objects",
  "Object Methods",
  "Error Handling",
  "DOM",
  "Events",
  "Local Storage",
  "Fetch API",
  "Promises",
  "Async/Await",
  "Mini Project"
];
    } 
    else if (goal === "learn html") {
      plan = [
  "HTML Basics",
  "Headings & Paragraphs",
  "Lists",
  "Links",
  "Images",
  "Tables",
  "Forms",
  "Semantic HTML",
  "Audio & Video",
  "HTML Entities",
  "Iframes",
  "Mini Project"
];
    } 
    else if (goal === "learn python") {
      plan = [
  "Introduction",
  "Variables",
  "Data Types",
  "Operators",
  "Conditionals",
  "Loops",
  "Functions",
  "Lists",
  "Tuples",
  "Dictionaries",
  "Sets",
  "File Handling",
  "Exception Handling",
  "Modules",
  "OOP",
  "Mini Project"
];
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Goal not supported"
      });
    }
    await Task.deleteMany({
  isGenerated: true
});
   const topicsPerDay = Math.ceil(plan.length / days);
   const remainingDays = days - plan.length;
   let extraTasks = [];
   if (remainingDays === 1) {
  extraTasks = ["Final Review"];
}
else if (remainingDays === 2) {
  extraTasks = [
    "Revision",
    "Final Review"
  ];
}
else if (remainingDays === 3) {
  extraTasks = [
    "Revision",
    "Mock Test",
    "Final Review"
  ];
}
else if (remainingDays === 4) {
  extraTasks = [
    "Revision",
    "Practice",
    "Mock Test",
    "Final Review"
  ];
}
else if (remainingDays === 5) {
  extraTasks = [
    "Revision",
    "Revision",
    "Practice",
    "Mock Test",
    "Final Review"
  ];
}



   console.log("Remaining Days:", remainingDays);

let difficulty = "";

if (topicsPerDay <= 3) {
  difficulty = "Easy 🟢";
} else if (topicsPerDay <= 5) {
  difficulty = "Moderate 🟡";
} else if (topicsPerDay <= 8) {
  difficulty = "Intensive 🟠";
} else {
  difficulty = "Extreme 🔴";
}

let warning = "";

if (
  difficulty === "Intensive 🟠" ||
  difficulty === "Extreme 🔴"
) {
  warning =
    "This roadmap may be difficult to complete. Consider increasing the number of days.";
}


let currentTopicIndex = 0;

for (let day = 1; day <= days; day++) {

  let dayTopics = [];

  for (let j = 0; j < topicsPerDay; j++) {

    if (currentTopicIndex < plan.length) {

      dayTopics.push(plan[currentTopicIndex]);

      currentTopicIndex++;

    }

  }

  if (dayTopics.length > 0) {
  await Task.create({
    title: `Day ${day} - ${dayTopics.join(", ")}`,
    isGenerated: true
  });
}
else {

  const extraTaskIndex =
    day - (days - remainingDays) - 1;

  await Task.create({
    title: `Day ${day} - ${extraTasks[extraTaskIndex]}`,
    isGenerated: true
  });

}

}

    res.status(200).json({
  success: true,
  plan,
  topicsPerDay,
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