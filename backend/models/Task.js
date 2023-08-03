const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "todo",
  },
});

const TaskModel = mongoose.model("tasks", TaskSchema);

module.exports = TaskModel;
