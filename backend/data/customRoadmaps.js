function generateCustomRoadmap(goal) {
  const userGoal = goal.toLowerCase();

  if (
    userGoal.includes("ai") ||
    userGoal.includes("artificial intelligence")
  ) {
    return [
      "Python",
      "NumPy",
      "Pandas",
      "Machine Learning",
      "Deep Learning",
      "Neural Networks",
      "Projects"
    ];
  }

  if (
    userGoal.includes("data science") ||
    userGoal.includes("data scientist")
  ) {
    return [
      "Python",
      "Statistics",
      "NumPy",
      "Pandas",
      "Data Visualization",
      "Machine Learning",
      "Projects"
    ];
  }

  if (
    userGoal.includes("cybersecurity") ||
    userGoal.includes("cyber security")
  ) {
    return [
      "Networking",
      "Linux",
      "Security Fundamentals",
      "Web Security",
      "Ethical Hacking",
      "Penetration Testing",
      "Projects"
    ];
  }

  return null;
}

module.exports = generateCustomRoadmap;