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
        `${goal} Full Course - FreeCodeCamp`,
        `${goal} Tutorial - Programming with Mosh`
      ],
      docs: [
        `Official ${goal} Documentation`,
        `${goal} Guide`
      ],
      practice: [
        "HackerRank",
        "LeetCode"
      ],
      projects: [
        `Build a ${goal} Project`,
        `Create a Portfolio Project using ${goal}`
      ]
    }
  });

}

};

module.exports = {
  generateAIResources
};