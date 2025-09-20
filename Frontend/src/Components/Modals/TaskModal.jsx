import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import close from "../../assets/close-icon.png";

const TaskModal = ({ status, onCreate, onClose }) => {
  const { id: projectId } = useParams();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef();

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

            <div className="w-1/2 flex flex-col gap-1.5">
              <label className="text-sm">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
            <label className="text-sm">Members</label>

            {/* Selected members as chips */}
            <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md px-2 py-1 min-h-[38px]">
              {selectedMembers.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center gap-1 bg-gray-200 px-2 py-0.5 rounded-md text-sm"
                >
                  {m.name}
                  <button
                    onClick={() => removeMember(m._id)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              <input
                type="text"
                className="flex-1 outline-none text-sm"
                placeholder="Select members..."
                onFocus={() => setShowDropdown(true)}
              />
            </div>

            {/* Dropdown */}
            {showDropdown && allMembers.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-50">
                {allMembers.map((member) => (
                  <div
                    key={member._id}
                    onClick={() => addMember(member)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {member.name}{" "}
                    <span className="text-gray-500">({member.email})</span>
                  </div>
                ))}
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
