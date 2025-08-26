import React from 'react'
import avatar from '../assets/avatar.png'
import edit_icon from '../assets/edit-icon.png'
import delete_icon from '../assets/delete-icon.png'

const Members = () => {
  return (
    <div className="flex-1 flex justify-center">

        <div className="w-full max-w-[1200px] flex flex-col gap-3 p-3">

            <h2 className='text-lg font-semibold mb-2'>Members</h2>

            <div className="w-full flex justify-between items-center px-4 py-2.5 rounded-md border border-gray-300">

              <div className="flex gap-5">
                <img className='w-10 h-10 aspect-square rounded-full' src={avatar} alt="" />
                <div className="">
                  <h2 className='font-semibold'>Stephen Raj M</h2>
                  <p className='text-xs text-gray-500'>mstephenraj@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-5">

                <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
                  <img 
                    className='w-5'
                    src={edit_icon} alt="" 
                  />
                </div>  

                <div className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
                  <img 
                    className='w-5'
                    src={delete_icon} alt="" 
                  />
                </div>                        
  
              </div>

            </div>
            
        </div>

    </div>
  )
}

export default Members