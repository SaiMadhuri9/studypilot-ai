const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters"],
    },
    goal: {
  type: String,
  required: true,
  trim: true,
},
    completed: {
      type: Boolean,
      default: false,
    },
    difficulty: {
    type: String,
    default: "easy"
  },
  


    isGenerated: {
  type: Boolean,
  default: false
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);