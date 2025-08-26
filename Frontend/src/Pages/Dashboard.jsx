import React from 'react'
import completed from '../assets/completed-icon.png'
import updated from '../assets/updated-icon.png'
import create from '../assets/create-icon.png'
import date from '../assets/date-icon.png'

const Dashboard = () => {
  return (
    <div className="flex-1 flex justify-center">

      <div className="w-full max-w-[1200px] flex justify-between gap-4 p-3">

        <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
          <img 
            className='w-5'
            src={completed} alt="" 
          />
          <div className="">
            <h2 className='font-medium'>0 completed</h2>
            <p className='text-xs text-gray-500'>in the last 7 days</p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
          <img 
            className='w-5'
            src={updated} alt="" 
          />
          <div className="">
            <h2 className='font-medium'>0 updated</h2>
            <p className='text-xs text-gray-500'>in the last 7 days</p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
          <img 
            className='w-5'
            src={create} alt="" 
          />
          <div className="">
            <h2 className='font-medium'>0 created</h2>
            <p className='text-xs text-gray-500'>in the last 7 days</p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 px-4 py-2 border border-gray-300 rounded-lg h-20">
          <img 
            className='w-5'
            src={date} alt="" 
          />
          <div className="">
            <h2 className='font-medium'>0 due soon</h2>
            <p className='text-xs text-gray-500'>in the last 7 days</p>
          </div>
        </div>
        
      </div>

    </div>
  )
}

export default Dashboard