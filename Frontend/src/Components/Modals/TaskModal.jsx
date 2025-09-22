import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import close from "../../assets/close-icon.png";
import dropdown from '../../assets/dropdown-icon.png'

const TaskModal = ({ status, onCreate, onClose }) => {
  const { id: projectId } = useParams();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const dropdownRef = useRef();
  const priorityRef = useRef();

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentProject = res.data.projects.find((p) => p._id === projectId);

      if (currentProject) {
        setAllMembers(currentProject.members);
      } else {
        setAllMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setAllMembers([]);
    }
  };

  const handleCreateTask = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("You must be logged in!");
        return;
      }

      if (!title || !dueDate) {
        toast.error("Please fill in all fields");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/projects/tasks/${projectId}`,
        {
          title,
          status,
          priority,
          dueDate,
          assignees: selectedMembers.map((m) => m._id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Task created successfully!");
      onCreate(res.data.task);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setShowPriorityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addMember = (member) => {
    if (!selectedMembers.find((m) => m._id === member._id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setShowDropdown(false);
  };

  const removeMember = (id) => {
    setSelectedMembers(selectedMembers.filter((m) => m._id !== id));
  };

  if (!onCreate) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="bg-white space-y-5 p-6 rounded-lg w-full max-w-[500px] relative">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Tasks</h2>
          <div
            onClick={onClose}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img src={close} className="w-4" alt="Close" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Task Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex gap-5">
            <div className="w-1/2 flex flex-col gap-1.5">
              <label className="text-sm">Due Date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-2 py-1 outline-none"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div ref={priorityRef} className="relative w-1/2 flex flex-col gap-1.5">
              <label className="text-sm">Priority</label>
              <div
                className="border border-gray-300 rounded-md px-2 py-1.5 outline-none cursor-pointer flex justify-between items-center"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
              >
                <span className="text-sm capitalize">{priority}</span>
                <img src={dropdown} className={`w-3 transition-all duration-300 ${showPriorityDropdown ? 'rotate-180' : ''}`} alt="" />
              </div>

              {/* Dropdown list */}
              {showPriorityDropdown && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md z-50">
                  {["low", "medium", "high"].map((level) => (
                    <div
                      key={level}
                      onClick={() => {
                        setPriority(level);
                        setShowPriorityDropdown(false);
                      }}
                      className={`px-3 py-1.5 cursor-pointer hover:bg-gray-100 capitalize text-sm ${
                        priority === level ? "bg-gray-200 font-medium" : ""
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div ref={dropdownRef} className="relative flex flex-col gap-1.5">
            <label className="text-sm">Members</label>

            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1">
                {selectedMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-2 bg-gray-100 pl-1.5 pr-3 py-1 rounded-full"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="text-sm font-medium">{member.name}</span>
                    <div
                      className="w-5 h-5 flex justify-center items-center text-lg cursor-pointer hover:text-red-500 hover:bg-red-100 rounded-full"
                      onClick={() => removeMember(member._id)}
                    >
                      &times;
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="border border-gray-300 rounded-md px-2 py-1.5 outline-none cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-gray-400">Select members</span>
            </div>

            {showDropdown && (
              <div className="w-full bg-white absolute top-full mt-1 rounded-md border border-gray-300 z-50 max-h-60 overflow-y-auto">
                {allMembers.length > 0 ? (
                  allMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 hover:bg-gray-200 cursor-pointer px-2 py-1.5"
                      onClick={() => addMember(member)}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="font-medium">{member.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-2 text-gray-500">
                    No members found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-end gap-5 mt-8">
          <button
            onClick={onClose}
            className="font-medium border border-gray-300 w-20 py-1 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTask}
            className="text-white bg-black font-medium w-20 py-1 rounded-md cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
