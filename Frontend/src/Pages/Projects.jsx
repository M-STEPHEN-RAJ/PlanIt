import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import add from '../assets/add-icon.png'
import Progressbar from '../Components/Progressbar';

const Projects = () => {

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {

        const token = sessionStorage.getItem("authToken");

        if (!token) {
            toast.error("You must be logged in!");
            navigate("/login");
            return;
        }

        const res = await axios.get('http://localhost:5000/api/projects', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setProjects(res.data.projects || []);
    }
    catch (error) {
        toast.error(error.response?.data?.message || "Error fetching projects");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex-1 flex justify-center">

        <div className="w-full max-w-[1200px] flex flex-col gap-5 p-3">

            <h2 className='text-lg font-semibold'>Projects</h2>

            <div className="grid grid-cols-4 gap-3">

                {projects.map((project) => (
                    <div 
                      key={project._id}
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="flex justify-between rounded border border-gray-300 px-4 py-2 cursor-pointer"
                    >

                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col">
                                <h2 className='font-medium'>{project.name}</h2>
                                <p className='text-xs text-gray-500'>{project.createdAt}</p>
                            </div>

                            <div className="flex items-center gap-2">
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

                                <p className='text-sm font-medium text-gray-500'>
                                  +5
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-start gap-5">

                            <div className="flex items-center gap-2 mt-1">
                                <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                                <p className='text-xs text-green-500 capitalize'>{project.status}</p>
                            </div>

                            <Progressbar />

                        </div>

                    </div>
                ))}

                <div className="h-32 flex justify-center items-center gap-3 rounded border border-gray-300 border-dashed cursor-pointer">
                    <img
                      className='w-4'
                      src={add} alt="" 
                    />
                    <p className='text-gray-500 text-sm'>Create new project</p>
                </div>

            </div>

        </div>
        
    </div>
  )
}

export default Projects