// App.js
import React, { useState, useEffect, useContext } from "react";
import Task from "./components/Task";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "./TaskContext";
const App = () => {
  const { tasks, setTasks } = useContext(TaskContext);
  const [count, setCount] = useState(0);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/fetchtasks`)
      .then((res) => res.json())
      .then((tasks) => setTasks(tasks));
    console.log("rendering");
  }, [count]);

  const fetchTasks = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}/fetchtasks`)
      .then((res) => res.json())
      .then((tasks) => setTasks(tasks));
  };

  const handleStatusChange = async (taskId, status) => {
    if (status === "done") {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/done/${taskId}`,
        {
          method: "POST",
        }
      );
      console.log(res);
      fetchTasks();
      return;
    }
    if (status === "update") {
      setCount((prev) => (prev = prev + 1));
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/updatetask/${taskId}`,
      {
        method: "POST",
        body: JSON.stringify({ status }),
        headers: {
          "content-type": "application/json",
        },
      }
    );

    // let filtered = tasks.find((item) => item.id === taskId);

    let idx = tasks.findIndex((item) => item.id === taskId);
    tasks[idx].status = status;
    setTasks((prev) => {
      return [...prev];
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleAddTask = async () => {
    if (newTask.title.trim() === "" || newTask.description.trim() === "") {
      return; // Don't add empty tasks
    }
    const title = newTask.title;
    const description = newTask.description;
    const id = await uuidv4();
    const status = "todo";
    console.log(id);

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/addtask`, {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        description,
        status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    const newTaskWithId = { ...newTask, id, status };
    setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
    setNewTask({ title: "", description: "" }); // Clear form after adding the task
  };

  return (
    <div className="w-full">
      <div className="max-w-lg container mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold mb-4">Task Manager</h1>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={newTask.title}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 mr-2 w-full mb-2"
          />
          <input
            type="text"
            name="description"
            placeholder="Task description"
            value={newTask.description}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 mr-2 w-full"
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full mt-4"
          >
            Add Task
          </button>
        </div>

        {tasks.map((task) => {
          return (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.title}
              status={task.status}
              onChangeStatus={handleStatusChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
