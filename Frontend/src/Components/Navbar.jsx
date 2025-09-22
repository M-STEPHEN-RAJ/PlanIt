import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import sidebar_open from "../assets/sidebar-open.svg";
import sidebar_close from "../assets/sidebar-close.svg";
import logo from "../assets/planit-logo.png";
import notification from "../assets/notification-icon.png";
import settings from "../assets/settings-icon.png";
import avatar from "../assets/avatar.png";
import camera from "../assets/camera-icon.png";
import { useSidebar } from "../Context/SidebarContext";
import { useNavigate } from "react-router-dom";
import AvatarModal from "./Modals/AvatarModal";

const Navbar = () => {
  const navigate = useNavigate();

  const { openSidebar, setOpenSidebar } = useSidebar();

  const [showProfile, setShowProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef();

  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("You must be logged in!");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
    
      <div className="h-14 flex justify-between items-center border-b border-b-gray-300 px-3 py-2">
        {/* Navbar Left */}
        <div className="flex justify-center items-center gap-10">
          <div
            onClick={() => setOpenSidebar(!openSidebar)}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img
              className="w-5"
              src={openSidebar ? sidebar_close : sidebar_open}
              alt=""
            />
          </div>

          <img
            onClick={() => navigate("/dashboard")}
            className="w-16 h-10 cursor-pointer"
            src={logo}
            alt=""
          />
        </div>

        {/* Navbar Right */}
        <div
          ref={profileRef}
          className="flex justify-center items-center gap-3"
        >
          <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
            <img className="w-5" src={notification} alt="" />
          </div>

          <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
            <img className="w-5" src={settings} alt="" />
          </div>

          <img
            className="w-9 h-9 object-cover rounded-full cursor-pointer p-1 hover:bg-gray-500/10"
            src={user?.avatar || avatar}
            alt=""
            onClick={() => setShowProfile(!showProfile)}
          />

          {showProfile && (
            <div className="absolute min-w-[265px] flex flex-col items-center gap-5 top-16 right-3 bg-white border border-gray-300 rounded-md p-4 z-50">
              <p className="text-sm font-medium text-gray-600">{user.email}</p>

              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={() => setShowModal(!showModal)}
                  className="relative cursor-pointer"
                >
                  <img
                    src={user?.avatar || avatar}
                    className="w-20 rounded-full aspect-square object-cover border-[0.5px] border-gray-200"
                    alt=""
                  />
                  <div className="absolute -bottom-1 -right-1 border-[0.5px] border-gray-200 bg-white rounded-full">
                    <img src={camera} className="w-7 p-1.5" alt="" />
                  </div>
                </div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
              </div>

              <div className="w-full flex justify-center gap-3">
                <button className="w-[110px] text-sm text-white bg-black py-1 rounded-full cursor-pointer">
                  Profile
                </button>
                <button className="w-[110px] text-sm font-medium border py-1 rounded-full cursor-pointer">
                  Logout
                </button>
              </div>

              <p className="text-xs text-gray-500">
                <span className="cursor-pointer hover:underline">
                  Terms & Conditions
                </span>{" "}
                &nbsp; • &nbsp;{" "}
                <span className="cursor-pointer hover:underline">
                  Privacy Policy
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && 
        <AvatarModal 
          onClose={() => setShowModal(false)} 
          avatar = {user?.avatar}
          onAvatarChange={(newAvatar) => {
            setUser((prev) => ({ ...prev, avatar: newAvatar }));
            toast.success("Avatar updated successfully!");
          }}
        />
      }

    </>
  );
};

export default Navbar;
