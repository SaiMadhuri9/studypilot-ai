const {
  generateResources
} = require("../services/geminiService");

const generateAIResources =
  async (req, res) => {

    try {

      const { goal } = req.body;

      if (!goal) {

        return res.status(400).json({
          success: false,
          message: "Goal is required"
        });

      }

      const aiResponse =
        await generateResources(goal);

      const resources =
        JSON.parse(aiResponse);

      res.status(200).json({
        success: true,
        resources
      });

    } catch (error) {

  console.log(error);

  const { goal } = req.body;

  res.status(200).json({
    success: true,
    resources: {
      videos: [
  {
    title: `${goal} Full Course - FreeCodeCamp`,
    url: "https://www.youtube.com/@freecodecamp"
  },
  {
    title: `${goal} Tutorial - Programming with Mosh`,
    url: "https://www.youtube.com/@programmingwithmosh"
  }
],
      docs: [
  {
    title: `Official ${goal} Documentation`,
    url: "https://developer.mozilla.org/"
  },
  {
    title: `${goal} Guide`,
    url: "https://www.w3schools.com/"
  }
],
      practice: [
  {
    title: "HackerRank",
    url: "https://www.hackerrank.com/"
  },
  {
    title: "LeetCode",
    url: "https://leetcode.com/"
  }
],
      projects: [
  {
    title: `Build a ${goal} Project`,
    url: "https://github.com/topics/projects"
  },
  {
    title: `Create a Portfolio Project using ${goal}`,
    url: "https://github.com/"
  }
]
    }
  });

}

};

module.exports = {
  generateAIResources
};