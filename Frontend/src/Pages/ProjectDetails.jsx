import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import edit from "../assets/edit-icon.png";
import add from "../assets/add-icon.png";
import more from "../assets/more-icon.png";
import deadline from "../assets/deadline-icon.png";
import high_priority from "../assets/high-priority.png";
import medium_priority from "../assets/medium-priority.png";
import low_priority from "../assets/low-priority.png";
import TaskModal from "../Components/Modals/TaskModal";
import search from "../assets/search-icon.png";
import filter from "../assets/filter-icon.png";
import DeleteModal from "../Components/Modals/DeleteModal";
import ProjectDetailsModal from "../Components/Modals/ProjectDetailsModal";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const filterRef = useRef(null);

  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [showProjectModal, setShowProjectModal] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchProjectDetails = async () => {
    try {
      setLoadingProject(true);
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
    } finally {
      setLoadingProject(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      const res = await axios.get(
        `http://localhost:5000/api/projects/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(res.data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const confirmDeleteTask = async () => {
  if (!taskToDelete) return;

  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      toast.error("You must be logged in!");
      setDeleteModalOpen(false);
      return;
    }

    await axios.delete(
      `http://localhost:5000/api/projects/tasks/${taskToDelete._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Task deleted successfully!");
    setTasks((prevTasks) =>
      prevTasks.filter((t) => t._id !== taskToDelete._id)
    );

    setDeleteModalOpen(false);
    setTaskToDelete(null);
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
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
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
        {loadingProject ? (
          <div className="">
            <p className="h-3 w-13 bg-gray-300 rounded-full animate-pulse mt-2"></p>

            <div className="flex items-center gap-5 mt-2 mb-5">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-300 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-1 mt-4">
              <p className="h-3 w-16 bg-gray-300 rounded-full animate-pulse mb-2"></p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="flex items-center gap-5 mt-5 mb-0.5">
              <div className="h-7 w-[250px] bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-300 rounded-sm animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="">
              <p className="text-sm font-medium text-gray-500">Projects</p>                
              
              <div className="flex items-center gap-3">
                <div onClick={() => setShowProjectModal(true)} className="flex items-center gap-1 hover:underline cursor-pointer">
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <div className="hover:bg-gray-100 p-1.5 rounded-full">
                    <img src={edit} className="w-4 h-4" alt="" />
                  </div>
                </div>
                <p
                  className={`text-xs px-4 py-0.5 rounded-3xl font-medium capitalize
                    ${
                      project.status === "assigned"
                        ? "text-blue-600 bg-blue-100"
                        : project.status === "development"
                        ? "text-yellow-600 bg-yellow-100"
                        : project.status === "testing"
                        ? "text-purple-600 bg-purple-100"
                        : project.status === "completed"
                        ? "text-green-600 bg-green-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
                >
                  {project.status}
                </p>
              </div>
              <div className="space-y-1 mt-3">
                <p className="text-sm text-gray-600">Created by</p>
                <div className="flex items-center gap-2.5">
                  <img
                    className="w-8 rounded-full"
                    src={project?.createdBy?.avatar}
                    alt=""
                  />
                  <p className="font-medium">{project?.createdBy?.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
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

              <div ref={filterRef} className="relative">
                <div
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="flex items-center px-2.5 py-0.5 border border-gray-300 rounded-sm cursor-pointer"
                >
                  <img className="w-4" src={filter} alt="" />
                  <p className="text-sm text-gray-600 font-medium ml-2.5 mr-1.5">
                    Filter
                  </p>
                  {selectedMember && (
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="flex justify-center items-center text-sm text-gray-600 px-1 hover:text-red-500 hover:bg-red-100 rounded-full cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {isFilterOpen && (
                  <div className="absolute top-7.5 w-48 bg-white border border-gray-300 rounded-sm">
                    {project?.members?.length > 0 ? (
                      <div className="flex flex-col max-h-60 overflow-y-auto">
                        {project.members.map((member) => (
                          <div
                            key={member._id}
                            onClick={() => {
                              setSelectedMember(member);
                              setIsFilterOpen(false);
                            }}
                            className={`flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                              selectedMember?._id === member._id
                                ? "bg-gray-200"
                                : ""
                            }`}
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-7 h-7 rounded-full"
                            />
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No members</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
            <h2 className="text-sm text-gray-500 font-medium p-2">ASSIGNED</h2>

            <div className="min-h-20 h-full flex flex-col gap-2 mt-2">
              {tasks
                .filter(
                  (task) =>
                    task.status === "assigned" &&
                    task.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    (!selectedMember ||
                      task.assignees?.some((a) => a._id === selectedMember._id))
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
                              onClick={() => {
                                setSelectedTask(task);
                                setSelectedStatus(task.status);
                                setModalMode("edit");
                                setShowModal(true);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setTaskToDelete(task);
                                setDeleteModalOpen(true);
                                setOpenMenu(null);
                              }}
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
                  setModalMode("create");
                  setSelectedTask(null);
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
                    task.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    (!selectedMember ||
                      task.assignees.some((a) => a._id === selectedMember._id))
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
                              onClick={() => {
                                setSelectedTask(task);
                                setSelectedStatus(task.status);
                                setModalMode("edit");
                                setShowModal(true);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setTaskToDelete(task);
                                setDeleteModalOpen(true);
                                setOpenMenu(null);
                              }}
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
                  setModalMode("create");
                  setSelectedTask(null);
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
                    task.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    (!selectedMember ||
                      task.assignees.some((a) => a._id === selectedMember._id))
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
                              onClick={() => {
                                setSelectedTask(task);
                                setSelectedStatus(task.status);
                                setModalMode("edit");
                                setShowModal(true);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setTaskToDelete(task);
                                setDeleteModalOpen(true);
                                setOpenMenu(null);
                              }}
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
                  setModalMode("create");
                  setSelectedTask(null);
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
                    task.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    (!selectedMember ||
                      task.assignees.some((a) => a._id === selectedMember._id))
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
                              onClick={() => {
                                setSelectedTask(task);
                                setSelectedStatus(task.status);
                                setModalMode("edit");
                                setShowModal(true);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setTaskToDelete(task);
                                setDeleteModalOpen(true);
                                setOpenMenu(null);
                              }}
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
                  setModalMode("create");
                  setSelectedTask(null);
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
          mode={modalMode}
          task={selectedTask}
          status={selectedStatus}
          onClose={() => setShowModal(false)}
          onCreate={() => fetchTasks()}
        />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        onConfirm={confirmDeleteTask}
      />

      <ProjectDetailsModal 
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        project={project}
        onUpdate={fetchProjectDetails}
      />

    </div>
  );
};

export default ProjectDetails;