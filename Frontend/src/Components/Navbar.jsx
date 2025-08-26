import React, { useState } from 'react'
import sidebar_open from '../assets/sidebar-open.svg'
import sidebar_close from '../assets/sidebar-close.svg'
import logo from '../assets/planit-logo.png'
import notification from '../assets/notification-icon.png'
import settings from '../assets/settings-icon.png'
import avatar from '../assets/avatar.png'
import { useSidebar } from '../Context/SidebarContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  const { openSidebar, setOpenSidebar } = useSidebar();

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
              className='w-5'
              src={openSidebar ? sidebar_close : sidebar_open} alt=""
            />
          </div>

          <img 
            onClick={() => navigate('/dashboard')}
            className='w-16 h-10 cursor-pointer'
            src={logo} alt="" 
          />

        </div>

        {/* Navbar Right */}
        <div className="flex justify-center items-center gap-3">

          <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
            <img 
              className='w-5'
              src={notification} alt="" 
            />
          </div>

          <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
            <img 
              className='w-5'
              src={settings} alt="" 
            />
          </div>

          <img 
            className='w-9 h-9 object-cover rounded-full cursor-pointer p-1 hover:bg-gray-500/10'
            src={avatar} alt="" 
          />

        </div>
      </div>
    </>
  )
}

export default Navbar