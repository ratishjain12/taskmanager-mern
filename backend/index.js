const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://taskmanager-mern.vercel.app"],
  })
);
app.use(express.json());

mongoose.connect(
  `mongodb+srv://ratishjain:${process.env.MONGO_PASSWORD}@cluster0.ibsssgs.mongodb.net/?retryWrites=true&w=majority`
);

app.get("/", (req, res) => {
  res.json("Testing");
});

app.get("/fetchtasks", async (req, res) => {
  const tasks = await Task.find({});
  res.json(tasks);
});

app.post("/addtask", async (req, res) => {
  const { id, title, description } = req.body;
  const post = await Task.create({ id, title, description });
  res.json("Successfully added task");
});

app.post("/done/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await Task.deleteOne({ id: id });
  res.json("Task deleted successfully");
});

app.post("/updatetask/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  console.log(status);
  await Task.updateOne({ id: id }, { status: status });
  res.json("done");
});

app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  await Task.updateOne({ id: id }, { title: title, description: description });
  res.json("done");
});

app.post("/updatetask/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  console.log(status);
  await Task.updateOne({ id: id }, { status: status });
  res.json("done");
});

app.listen(3000, () => {
  console.log("server started");
});
