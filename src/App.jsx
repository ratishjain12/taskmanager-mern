// App.js
import React, { useState, useEffect } from "react";
import Task from "./components/Task";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "./TaskContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [track, setTrack] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/fetchtasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, [track]);

  const handleStatusChange = async (taskId, status) => {
    if (status === "done") {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/done/${taskId}`,
        {
          method: "POST",
        }
      );
      console.log(res);
      setTrack(!track);
      if (res.ok) {
        toast.success("Task Done!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("An error occured", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
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

    setTrack(!track);

    if (res.ok) {
      toast.success("Status updated!!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error("An error occured", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
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
    if (res.ok) {
      toast.success("Task added Successfully!!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error("An error occured", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setTrack(!track); // Clear form after adding the task
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
            className="border rounded px-4 py-2 mr-2 w-full mb-2 "
          />
          <input
            type="text"
            name="description"
            placeholder="Task description"
            value={newTask.description}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 mr-2 w-full "
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full mt-4"
          >
            Add Task
          </button>
        </div>
        <TaskContext.Provider value={{ track, setTrack }}>
          {tasks.length > 0 &&
            tasks.map((task) => {
              console.log(task);
              return (
                <Task
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  onChangeStatus={handleStatusChange}
                />
              );
            })}
        </TaskContext.Provider>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  );
};

export default App;
