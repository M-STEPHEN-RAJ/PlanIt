import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import edit_icon from "../assets/edit-icon.png";
import delete_icon from "../assets/delete-icon.png";
import { useState } from "react";
import { useEffect } from "react";

const Members = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("You must be logged in!");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(res.data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching Members!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-3 p-3">
        <h2 className="text-lg font-semibold mb-2">Members</h2>

        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full flex justify-between items-center px-4 py-2.5 rounded-md border border-gray-300 animate-pulse"
              >
                <div className="flex gap-5 items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-28 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          : members.map((member) => (
              <div
                key={member._id}
                className="w-full flex justify-between items-center px-4 py-2.5 rounded-md border border-gray-300"
              >
                <div className="flex gap-5">
                  <img
                    className="w-10 h-10 aspect-square rounded-full object-cover"
                    src={member.avatar}
                    alt=""
                  />
                  <div className="">
                    <h2 className="font-semibold">{member.name}</h2>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
                    <img className="w-5" src={edit_icon} alt="" />
                  </div>

                  <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
                    <img className="w-5" src={delete_icon} alt="" />
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Members;
