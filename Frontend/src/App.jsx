import React from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast'
import { Route, Routes, useLocation } from 'react-router-dom'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Dashboard from './Pages/Dashboard'
import Projects from './Pages/Projects'
import ProjectDetails from './Pages/ProjectDetails'
import Calendar from './Pages/Calendar'
import Members from './Pages/Members'
import { useSidebar } from './Context/SidebarContext'

const App = () => {

  const { openSidebar } = useSidebar();

  const location = useLocation();

  const hideLayout = ['/', '/login'].includes(location.pathname);

  return (
    <>

    <Toaster position="top-center" reverseOrder={true} />

    {!hideLayout && (
      <div className="fixed top-0 w-full bg-white z-50">
        <Navbar />
      </div>
    )}

    <div className={`${hideLayout ? '' : 'flex mt-14'}`}>

      {!hideLayout && (
        <div className="fixed top-14 left-0 z-50">
          <Sidebar />
        </div>
      )}
    
      <div className={`${hideLayout ? 'w-full' : openSidebar ? '' : 'ml-60'} flex-1`}>
        <Routes>
          <Route path='/' element={<SignUp />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/projects' element={<Projects />}/>
          <Route path='/projects/:id' element={<ProjectDetails />}/>
          <Route path='/calendar' element={<Calendar />}/>
          <Route path='/members' element={<Members />}/>
        </Routes>
      </div>

    </div>

    </>
  )
}

export default App