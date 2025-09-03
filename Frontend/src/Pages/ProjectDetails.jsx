import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'
import add from '../assets/add-icon.png'
import more from '../assets/more-icon.png'
import deadline from '../assets/deadline-icon.png'
import medium_priority from '../assets/medium-priority.png'

const ProjectDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);

  const fetchProjectDetails = async () => {
    try {

        const token = sessionStorage.getItem("authToken");

        if (!token) {
            toast.error("You must be logged in!");
            navigate("/login");
            return;
        }        

        const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        setProject(res.data.project);
        
    }
    catch (error) {
        toast.error(error.response?.data?.message || "Error fetching project"); 
    }
  }

  const fetchTasks = async () => {
    try {
        const token = sessionStorage.getItem("authToken");
        if (!token) return;

        const res = await axios.get(
            `http://localhost:5000/api/projects/tasks/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setTasks(res.data.tasks || []);
    } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching tasks");
    }    
  }

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [id]);

  return (
    <div className='flex-1 flex justify-center'>

        <div className="w-full max-w-[1200px] flex flex-col gap-5 p-3">

            <div className="">
                <p className='text-sm font-medium text-gray-500'>Projects</p>
                <div className="flex items-center gap-5">
                    <h2 className='text-lg font-semibold'>{project.name}</h2>
                    <p className='text-xs text-green-600 bg-green-100 px-4 py-0.5 rounded-3xl capitalize'>{project.status}</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">

                <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
                    <h2 className='text-sm text-gray-500 font-medium p-2'>ASSIGNED</h2>

                    <div className="min-h-20 h-full flex flex-col gap-2 mt-2">

                        <div className="h-28 flex flex-col justify-between bg-white px-4 py-2 rounded-sm shadow">
                            
                            <div className="flex justify-between items-center">
                                <h2 className='w-4/5 text-sm font-medium truncate'>{tasks[0]?.title}</h2>
                                <div className="p-1 rounded-full hover:bg-gray-500/10 cursor-pointer">
                                    <img 
                                      className='w-4'
                                      src={more} 
                                      alt="" 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <img className="w-4" src={deadline} alt="" />
                                <p className='text-red-600 text-xs'>{tasks[0]?.dueDate}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    <img
                                      className="w-8 h-8 rounded-full border-2 border-white"
                                      src="https://randomuser.me/api/portraits/men/32.jpg"
                                      alt=""
                                    />
                                    <img
                                      className="w-8 h-8 rounded-full border-2 border-white"
                                      src="https://randomuser.me/api/portraits/women/44.jpg"
                                      alt=""
                                    />
                                    <img
                                      className="w-8 h-8 rounded-full border-2 border-white"
                                      src="https://randomuser.me/api/portraits/men/46.jpg"
                                      alt=""
                                    />
                                </div>

                                <div className="p-1 rounded-sm hover:bg-gray-500/10 cursor-pointer">
                                    <img
                                      className='w-4'
                                      src={medium_priority} 
                                      alt="" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer">
                            <img 
                              className='w-4'
                              src={add} 
                              alt="" 
                            />
                            <p className='text-gray-500 text-sm'>Create</p>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
                    <h2 className='text-sm text-gray-500 font-medium p-2'>IN PROGRESS</h2>

                    <div className="h-20 mt-2">
                        <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer">
                            <img 
                            className='w-4'
                            src={add} 
                            alt="" 
                            />
                            <p className='text-gray-500 text-sm'>Create</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
                    <h2 className='text-sm text-gray-500 font-medium p-2'>IN REVIEW</h2>

                    <div className="h-20 mt-2">
                        <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer">
                            <img 
                            className='w-4'
                            src={add} 
                            alt="" 
                            />
                            <p className='text-gray-500 text-sm'>Create</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col p-2 bg-gray-500/5 rounded-sm">
                    <h2 className='text-sm text-gray-500 font-medium p-2'>DONE</h2>

                    <div className="h-20 mt-2">
                        <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-500/10 cursor-pointer">
                            <img 
                            className='w-4'
                            src={add} 
                            alt="" 
                            />
                            <p className='text-gray-500 text-sm'>Create</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
  )
}

export default ProjectDetails