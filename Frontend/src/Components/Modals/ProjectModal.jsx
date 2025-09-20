import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import close from "../../assets/close-icon.png";

const ProjectModal = ({ isOpen, onClose, setRefresh }) => {
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [projectName, setProjectName] = useState("");

  const dropdownRef = useRef();

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen]);

  const fetchMembers = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllMembers(res.data.users);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleCreate  = async () => {

    if(!projectName || selectedMembers.length === 0) {
      toast.error("Please enter project name and select members!");
      return;
    }

    const data = {
      name: projectName,
      members: selectedMembers.map((m) => m._id),
    }

    try {
      const token = sessionStorage.getItem("authToken");
      const res = await axios.post("http://localhost:5000/api/projects", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success("Project created successfully!");
      onClose();
      setProjectName("");
      setSelectedMembers([]); 

      setRefresh((prev) => !prev);
    }
    catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    }
  }

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="bg-white space-y-5 p-6 rounded-lg w-full max-w-[500px] relative">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Project</h2>
          <div
            onClick={onClose}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img src={close} className="w-4" alt="Close" />
          </div>
        </div>

        <div className="space-y-3">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Project Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 outline-none"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          {/* Dropdown */}
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
           onClick={handleCreate}
           className="text-white bg-black font-medium w-20 py-1 rounded-md cursor-pointer">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
