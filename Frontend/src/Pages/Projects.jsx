import React from 'react'
import add from '../assets/add-icon.png'
import { useNavigate } from 'react-router-dom'

const Projects = () => {

  const navigate = useNavigate();

  return (
    <div className="flex-1 flex justify-center">

        <div className="w-full max-w-[1200px] flex flex-col gap-5 p-3">

            <h2 className='text-lg font-semibold'>Projects</h2>

            <div className="grid grid-cols-4 gap-3">

                <div 
                  onClick={() => navigate('/projects/farm-smart')}
                  className="flex justify-between rounded border border-gray-300 px-4 py-2 cursor-pointer"
                >

                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                            <h2 className='font-medium'>FarmSmart AI</h2>
                            <p className='text-xs text-gray-500'>2 days ago</p>
                        </div>

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
                    </div>

                    <div className="flex flex-col justify-start gap-5">

                        <div className="flex items-center gap-2 mt-1">
                            <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                            <p className='text-xs text-green-500'>Assigned</p>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-1">
                            <svg width="50px" height="50px" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="8"
                                />
                                
                                {/* Progress circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="8"
                                    strokeDasharray="282.6"
                                    strokeDashoffset="280.6"
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                                
                                {/* Value text */}
                                <text
                                    x="50%"
                                    y="50%"
                                    dominantBaseline="middle"
                                    textAnchor="middle"
                                    fontSize="20"
                                    className="font-semibold fill-gray-700"
                                >
                                    0%
                                </text>
                            </svg>

                            <p className='text-[10px] text-gray-500'>Completed</p>
                        </div>

                    </div>

                </div>

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