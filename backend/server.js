const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();
// console.log("Gemini Key:", process.env.GEMINI_API_KEY);
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const studyPlanRoutes = require("./routes/studyPlanRoutes");
const resourceRoutes =
require("./routes/resourceRoutes");
const noteRoutes =
require("./routes/noteRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/studyplan", studyPlanRoutes);
app.use(
  "/api/resources",
  resourceRoutes
);
app.use(
  "/api/notes",
  noteRoutes
);

// routes
console.log("Loading task routes...");
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// Vercel-compatible routes
const { getGoals, getRoadmaps } = require("./controllers/taskController");
app.get("/api/goals", getGoals);
app.get("/api/roadmaps", getRoadmaps);


// app.get("/", (req, res) => {
//   res.send("StudyPilot backend running 🚀");
// });

const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
connectDB();
const Task = require("./models/Task");



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.get("/tasks", (req, res) => {
//   res.json({ message: "Direct route working" });
// });