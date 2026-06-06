const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
console.log("Loading task routes...");
const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);


// app.get("/", (req, res) => {
//   res.send("StudyPilot backend running 🚀");
// });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.get("/tasks", (req, res) => {
//   res.json({ message: "Direct route working" });
// });