require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const Task = require("../backend/models/Task");
const { generateRoadmap } = require("../backend/services/geminiService");
const goalMappings = require("../backend/data/goalMappings");
const aliases = require("../backend/data/aliases");
const generateCustomRoadmap =
  require("../backend/data/customRoadmaps");

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    cachedConnection = connection;
    console.log("MongoDB connected");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  try {
    await connectToDatabase();

    // POST /api/generate
    if (req.method === "POST") {
      const { goal, days } = req.body;

      if (!goal) {
        return res.status(400).json({
          success: false,
          message: "Goal is required",
        });
      }

      if (!days) {
        return res.status(400).json({
          success: false,
          message: "Days is required",
        });
      }

      const userGoal = goal.toLowerCase();
      let plan = [];

      try {
        const aiRoadmap = await generateRoadmap(goal, days);
        plan = JSON.parse(aiRoadmap);
        console.log("AI Roadmap Generated");
      } catch (error) {
        console.log("Error generating AI roadmap, using fallback roadmap.");
      }

      if (plan.length > 0) {
        await Task.deleteMany({
          goal: goal,
          isGenerated: true,
        });

        for (const item of plan) {
          await Task.create({
            title: `Day ${item.day} - ${item.topic}`,
            goal: goal,
            difficulty: "moderate",
            isGenerated: true,
          });
        }

        return res.status(200).json({
          success: true,
          aiGenerated: true,
          plan,
        });
      }

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
        const customPlan = generateCustomRoadmap(goal);

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
            "Full Stack Developer",
          ],
        });
      }

      const topicsPerDay = Math.ceil(plan.length / days);
      const finalPlan = [];

      for (let i = 0; i < days; i++) {
        const topics = plan.slice(
          i * topicsPerDay,
          (i + 1) * topicsPerDay
        );

        for (const topic of topics) {
          finalPlan.push({
            day: i + 1,
            topic: topic.name || topic,
          });
        }
      }

      await Task.deleteMany({
        goal: goal,
        isGenerated: true,
      });

      for (const item of finalPlan) {
        await Task.create({
          title: `Day ${item.day} - ${item.topic}`,
          goal: goal,
          difficulty: "moderate",
          isGenerated: true,
        });
      }

      return res.status(200).json({
        success: true,
        aiGenerated: false,
        plan: finalPlan,
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
