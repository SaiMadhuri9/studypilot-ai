const customRoadmapKeywords = require("./customRoadmapKeywords");

function generateCustomRoadmap(goal) {

  const userGoal = goal.toLowerCase();

  let roadmap = [];

  for (const keyword of Object.keys(customRoadmapKeywords)) {

    if (userGoal.includes(keyword)) {

      roadmap.push(
        ...customRoadmapKeywords[keyword]
      );

    }

  }

  roadmap = [...new Set(roadmap)];

  if (roadmap.length > 0) {

    roadmap.push("Projects");

    return roadmap;

  }

  return null;

}

module.exports = generateCustomRoadmap;