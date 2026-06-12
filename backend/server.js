const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const studyPlanRoutes = require("./routes/studyPlanRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/studyplan", studyPlanRoutes);

// routes
console.log("Loading task routes...");
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);


// app.get("/", (req, res) => {
//   res.send("StudyPilot backend running 🚀");
// });

const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.get("/tasks", (req, res) => {
//   res.json({ message: "Direct route working" });
// });