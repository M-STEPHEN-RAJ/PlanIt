import React, { useState } from 'react'
import { toast } from "react-hot-toast";
import dashboard from '../assets/dashboard-icon.png'
import dashboard_active from '../assets/dashboard-active-icon.png'
import project from '../assets/project-icon.png'
import project_active from '../assets/project-active-icon.png'
import date from '../assets/date-active-icon.png'
import date_active from '../assets/date-icon.png'
import members from '../assets/members-icon.png'
import members_active from '../assets/members-active-icon.png'
import logout from '../assets/logout-icon.png'
import { useSidebar } from '../Context/SidebarContext'
import { useNavigate } from 'react-router-dom'
import LogoutModal from './Modals/LogoutModal';

const Sidebar = () => {
  const navigate = useNavigate()
  const { openSidebar, sidebarActive, setSidebarActive } = useSidebar()

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: dashboard,
      activeIcon: dashboard_active,
      path: '/dashboard',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: project,
      activeIcon: project_active,
      path: '/projects',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: date,
      activeIcon: date_active,
      path: '/calendar',
    },
    {
      id: 'members',
      label: 'Members',
      icon: members,
      activeIcon: members_active,
      path: '/members',
    },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('authToken')
    navigate('/login')
    toast.success("logged out successfully!");
  }

  return (
    <div
      className={`flex flex-col justify-between h-[calc(100vh-56px)] border-r border-r-gray-300 ${
        openSidebar
          ? 'w-0 overflow-hidden px-0 py-3'
          : 'w-60 px-3 py-3'
      }`}
    >
      {/* Sidebar Menu Items */}
      <div className="flex flex-col gap-0.5">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSidebarActive(item.id)
              navigate(item.path)
            }}
            className={`relative flex items-center gap-3 hover:scale-[1.03] transition-all duration-200
              ${
                sidebarActive === item.id
                  ? 'bg-gray-500/10 hover:bg-gray-500/20 scale-[1.03] after:content-[""] after:absolute after:left-0 after:w-0.5 after:h-[45%] after:bg-black after:rounded-2xl'
                  : 'hover:bg-gray-600/5'
              } px-2.5 py-1.5 rounded-sm cursor-pointer`}
          >
            <img
              className="w-4 h-4"
              src={sidebarActive === item.id ? item.activeIcon : item.icon}
              alt=""
            />
            <p
              className={`text-sm font-medium ${
                sidebarActive === item.id ? '' : 'text-gray-500'
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Logout Section */}
      <div
        onClick={() => setShowLogoutModal(true)}
        className="flex items-center gap-3 px-2.5 py-2 rounded-sm hover:bg-gray-600/10 hover:scale-[1.03] transition-all duration-200 cursor-pointer"
      >
        <img src={logout} alt="logout" className="w-4 h-4" />
        <p className="text-sm font-medium">Logout</p>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

    </div>
  )
}

export default Sidebar
