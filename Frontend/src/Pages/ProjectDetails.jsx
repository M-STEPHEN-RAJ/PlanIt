import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import add from "../assets/add-icon.png";
import more from "../assets/more-icon.png";
import deadline from "../assets/deadline-icon.png";
import high_priority from "../assets/high-priority.png";
import medium_priority from "../assets/medium-priority.png";
import low_priority from "../assets/low-priority.png";
import convertTime from "../utils/convertTime";
import TaskModal from "../Components/Modals/TaskModal";
import search from "../assets/search-icon.png";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchProjectDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("You must be logged in!");
        navigate("/login");
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProject(res.data.project);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching project");
    }
  };

  const fetchTasks = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      const res = await axios.get(
        `http://localhost:5000/api/projects/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(res.data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching tasks");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("You must be logged in!");
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:5000/api/projects/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Task deleted successfully!");

      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task!");
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".dropdown-toggle") &&
        !e.target.closest(".dropdown-menu")
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-5 p-3">
        <div className="">
          <p className="text-sm font-medium text-gray-500">Projects</p>
          <div className="flex items-center gap-5">
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <p className="text-xs text-green-600 bg-green-100 px-4 py-0.5 rounded-3xl capitalize">
              {project.status}
            </p>
          </div>
        </div>

        <div className="">
          <div className="flex items-center gap-2 w-[250px] px-2 py-1 border border-gray-300 rounded-full">
            <img className="w-4.5" src={search} alt="" />
            <input
              className="w-full text-sm pr-1 outline-none"
              type="text"
              placeholder="Search tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
            <h2 className="text-sm text-gray-500 font-medium p-2">ASSIGNED</h2>

            <div className="min-h-20 h-full flex flex-col gap-2 mt-2">
              {tasks
                .filter(
                  (task) =>
                    task.status === "assigned" &&
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((task) => (
                  <div
                    key={task._id}
                    className="h-28 flex flex-col justify-between bg-white px-4 py-2 rounded-sm shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="w-4/5 text-sm font-medium truncate">
                        {task.title}
                      </h2>
                      <div className="relative">
                        <div
                          className="dropdown-toggle p-1 rounded-full hover:bg-gray-500/10 cursor-pointer"
                          onClick={() =>
                            setOpenMenu(openMenu === task._id ? null : task._id)
                          }
                        >
                          <img className="w-4" src={more} alt="" />
                        </div>

                        {openMenu === task._id && (
                          <div className="dropdown-menu absolute right-0 mt-1 w-24 bg-white border border-gray-300 rounded z-10">
                            <button
                              onClick={() => console.log("Edit", task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <img className="w-4" src={deadline} alt="" />
                      <p className="text-red-600 text-xs">{task.dueDate}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {task?.assignees?.map((user) => (
                          <img
                            key={user._id}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src={user.avatar}
                            alt=""
                            title={user.name}
                          />
                        ))}
                      </div>

                      <div className="p-1 rounded-sm hover:bg-gray-500/10 cursor-pointer">
                        <img
                          className="w-4"
                          src={
                            task.priority === "high"
                              ? high_priority
                              : task.priority === "medium"
                              ? medium_priority
                              : low_priority
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ))}

              <div
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("assigned");
                  setShowModal(true);
                }}
              >
                <img className="w-4" src={add} alt="" />
                <p className="text-gray-500 text-sm">Create</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
            <h2 className="text-sm text-gray-500 font-medium p-2">
              IN PROGRESS
            </h2>

            <div className="min-h-20 h-full flex flex-col gap-2 mt-2">
              {tasks
                .filter(
                  (task) =>
                    task.status === "progress" &&
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((task) => (
                  <div
                    key={task._id}
                    className="h-28 flex flex-col justify-between bg-white px-4 py-2 rounded-sm shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="w-4/5 text-sm font-medium truncate">
                        {task.title}
                      </h2>
                      <div className="relative">
                        <div
                          className="dropdown-toggle p-1 rounded-full hover:bg-gray-500/10 cursor-pointer"
                          onClick={() =>
                            setOpenMenu(openMenu === task._id ? null : task._id)
                          }
                        >
                          <img className="w-4" src={more} alt="" />
                        </div>

                        {openMenu === task._id && (
                          <div className="dropdown-menu absolute right-0 mt-1 w-24 bg-white border border-gray-300 rounded z-10">
                            <button
                              onClick={() => console.log("Edit", task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <img className="w-4" src={deadline} alt="" />
                      <p className="text-red-600 text-xs">{task.dueDate}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {task?.assignees?.map((user) => (
                          <img
                            key={user._id}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src={user.avatar}
                            alt=""
                            title={user.name}
                          />
                        ))}
                      </div>

                      <div className="p-1 rounded-sm hover:bg-gray-500/10 cursor-pointer">
                        <img
                          className="w-4"
                          src={
                            task.priority === "high"
                              ? high_priority
                              : task.priority === "medium"
                              ? medium_priority
                              : low_priority
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ))}
              <div
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("progress");
                  setShowModal(true);
                }}
              >
                <img className="w-4" src={add} alt="" />
                <p className="text-gray-500 text-sm">Create</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
            <h2 className="text-sm text-gray-500 font-medium p-2">IN REVIEW</h2>

            <div className="min-h-20 h-full flex flex-col gap-2 mt-2">
              {tasks
                .filter(
                  (task) =>
                    task.status === "review" &&
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((task) => (
                  <div
                    key={task._id}
                    className="h-28 flex flex-col justify-between bg-white px-4 py-2 rounded-sm shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="w-4/5 text-sm font-medium truncate">
                        {task.title}
                      </h2>
                      <div className="relative">
                        <div
                          className="dropdown-toggle p-1 rounded-full hover:bg-gray-500/10 cursor-pointer"
                          onClick={() =>
                            setOpenMenu(openMenu === task._id ? null : task._id)
                          }
                        >
                          <img className="w-4" src={more} alt="" />
                        </div>

                        {openMenu === task._id && (
                          <div className="dropdown-menu absolute right-0 mt-1 w-24 bg-white border border-gray-300 rounded z-10">
                            <button
                              onClick={() => console.log("Edit", task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <img className="w-4" src={deadline} alt="" />
                      <p className="text-red-600 text-xs">{task.dueDate}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {task?.assignees?.map((user) => (
                          <img
                            key={user._id}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src={user.avatar}
                            alt=""
                            title={user.name}
                          />
                        ))}
                      </div>

                      <div className="p-1 rounded-sm hover:bg-gray-500/10 cursor-pointer">
                        <img
                          className="w-4"
                          src={
                            task.priority === "high"
                              ? high_priority
                              : task.priority === "medium"
                              ? medium_priority
                              : low_priority
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ))}
              <div
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("review");
                  setShowModal(true);
                }}
              >
                <img className="w-4" src={add} alt="" />
                <p className="text-gray-500 text-sm">Create</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
            <h2 className="text-sm text-gray-500 font-medium p-2">DONE</h2>

            <div className="min-h-20 h-full flex flex-col gap-2 mt-2">
              {tasks
                .filter(
                  (task) =>
                    task.status === "done" &&
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((task) => (
                  <div
                    key={task._id}
                    className="h-28 flex flex-col justify-between bg-white px-4 py-2 rounded-sm shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="w-4/5 text-sm font-medium truncate">
                        {task.title}
                      </h2>
                      <div className="relative">
                        <div
                          className="dropdown-toggle p-1 rounded-full hover:bg-gray-500/10 cursor-pointer"
                          onClick={() =>
                            setOpenMenu(openMenu === task._id ? null : task._id)
                          }
                        >
                          <img className="w-4" src={more} alt="" />
                        </div>

                        {openMenu === task._id && (
                          <div className="dropdown-menu absolute right-0 mt-1 w-24 bg-white border border-gray-300 rounded z-10">
                            <button
                              onClick={() => console.log("Edit", task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <img className="w-4" src={deadline} alt="" />
                      <p className="text-red-600 text-xs">{task.dueDate}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {task?.assignees?.map((user) => (
                          <img
                            key={user._id}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src={user.avatar}
                            alt=""
                            title={user.name}
                          />
                        ))}
                      </div>

                      <div className="p-1 rounded-sm hover:bg-gray-500/10 cursor-pointer">
                        <img
                          className="w-4"
                          src={
                            task.priority === "high"
                              ? high_priority
                              : task.priority === "medium"
                              ? medium_priority
                              : low_priority
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ))}
              <div
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("done");
                  setShowModal(true);
                }}
              >
                <img className="w-4" src={add} alt="" />
                <p className="text-gray-500 text-sm">Create</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <TaskModal
          status={selectedStatus}
          onClose={() => setShowModal(false)}
          onCreate={(taskData) => {
            setShowModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
