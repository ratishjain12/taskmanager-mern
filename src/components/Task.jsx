// Task.js
import React, { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { TaskContext } from "../TaskContext";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 305,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Task = ({ id, title, description, onChangeStatus, status }) => {
  const { tasks, setTasks } = useContext(TaskContext);
  title = tasks[tasks.findIndex((item) => item.id === id)].title;
  description = tasks[tasks.findIndex((item) => item.id === id)].description;
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const [newTask, setNewTask] = useState({
    title: title,
    description: description,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleUpdate = async () => {
    const title = newTask.title;
    const description = newTask.description;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/update/${id}`, {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    onChangeStatus(id, "update");
    setOpen(false);
  };

  return (
    <div className="border p-4 mb-4 ">
      <h3
        className={`text-lg font-semibold ${
          status == "todo" ? "bg-blue-500 p-2" : "bg-yellow-500 p-2 text-black"
        } `}
      >
        {title}
      </h3>
      <p className="mt-2 text-white p-2 border-b-2 border-gray-500">
        {description}
      </p>
      <div className="mt-4 flex flex-col flex-wrap gap-2 md:flex-row md:items-center ">
        <span>CHANGE STATUS: </span>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => onChangeStatus(id, "todo")}
        >
          To Do
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={() => onChangeStatus(id, "inProgress")}
        >
          In Progress
        </button>
        <button
          className="bg-red-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={handleOpen}
        >
          Update
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-black"
            >
              Update Task
            </Typography>

            <div className="mb-4 mt-2">
              <label htmlFor="title" className="text-black">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={handleInputChange}
                className="border rounded px-4 py-2 mr-2 w-full mb-2"
              />
              <label htmlFor="description" className="text-black">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={handleInputChange}
                className="border rounded px-4 py-2 mr-2 w-full"
              />
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full mt-4"
              >
                Update
              </button>
            </div>
          </Box>
        </Modal>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => onChangeStatus(id, "done")}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Task;
