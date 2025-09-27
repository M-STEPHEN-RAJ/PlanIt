import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import close from "../../assets/close-icon.png";
import dropdown from "../../assets/dropdown-icon.png";
import { API_BASE_URL } from "../../utils/api";

const statusOptions = ["assigned", "development", "testing", "completed"];

const ProjectDetailsModal = ({ isOpen, onClose, project, onUpdate }) => {
  const dropdownRef = useRef(null);
  const memberDropdownRef = useRef(null);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [openMemberDropdown, setOpenMemberDropdown] = useState(false);

  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    setName(project?.name || "");
    setStatus(project?.status || "");
    setMembers(project?.members || []);
  }, [project]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/api/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data.users || []);
    } catch (err) {
      toast.error("Failed to fetch members");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatusDropdown(false);
      }
      if (
        memberDropdownRef.current &&
        !memberDropdownRef.current.contains(event.target)
      ) {
        setOpenMemberDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("You must be logged in!");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/api/projects/${project._id}`,
        { name, status, members: members.map((m) => m._id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Project updated!");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="bg-white space-y-5 p-6 rounded-lg w-full max-w-[500px] relative">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Update Project</h2>
          <div
            onClick={onClose}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img src={close} className="w-4" alt="Close" />
          </div>
        </div>

        <div className="space-y-3">
          {/* Project Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Project Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div ref={dropdownRef} className="flex flex-col gap-1.5 relative">
            <label className="text-sm">Status</label>
            <div
              className="border border-gray-300 rounded-md pr-3 px-2 py-1 cursor-pointer flex justify-between items-center bg-white"
              onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
            >
              <span className="capitalize">{status || "Select status"}</span>
              <img
                src={dropdown}
                className={`w-3 transition-all duration-200 ${
                  openStatusDropdown ? "rotate-180" : ""
                }`}
                alt=""
              />
            </div>

            {openStatusDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 border border-gray-300 rounded-md bg-white shadow-lg z-10">
                {statusOptions.map((opt) => (
                  <div
                    key={opt}
                    className={`px-3 py-2 cursor-pointer capitalize hover:bg-gray-100 ${
                      opt === status ? "bg-gray-200 font-medium" : ""
                    }`}
                    onClick={() => {
                      setStatus(opt);
                      setOpenStatusDropdown(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member Dropdown */}
          <div
            ref={memberDropdownRef}
            className="relative flex flex-col gap-1.5"
          >
            <label className="text-sm">Members</label>

            {/* Selected members */}
            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1">
                {members.map((member) => (
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
                      onClick={() =>
                        setMembers(members.filter((m) => m._id !== member._id))
                      }
                    >
                      &times;
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropdown toggle */}
            <div
              className="border border-gray-300 rounded-md px-2 py-1.5 outline-none cursor-pointer"
              onClick={() => setOpenMemberDropdown(!openMemberDropdown)}
            >
              <span className="text-gray-400">Select members</span>
            </div>

            {/* Dropdown list */}
            {openMemberDropdown && (
              <div className="w-full bg-white absolute top-full mt-1 rounded-md border border-gray-300 z-50 max-h-60 overflow-y-auto shadow-lg">
                {allUsers.length > 0 ? (
                  allUsers.map((user) => {
                    const isSelected = members.some((m) => m._id === user._id);
                    return (
                      <div
                        key={user._id}
                        className={`flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-gray-200 ${
                          isSelected ? "bg-gray-200 font-medium" : ""
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            setMembers(
                              members.filter((m) => m._id !== user._id)
                            );
                          } else {
                            setMembers([...members, user]);
                          }
                          setOpenMemberDropdown(false);
                        }}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="font-medium">{user.name}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-2 text-gray-500">
                    No members found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            className="font-medium border border-gray-300 w-20 py-1 rounded-md cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="text-white flex justify-center items-center bg-black font-medium w-20 py-1 rounded-md cursor-pointer"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
