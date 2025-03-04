import React from 'react'


// icons
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";


export default function UsersOverview() {
  return (
    <div className='px-14 py-6 w-full bg-white rounded-xl shadow-md shadow-gray-300' >
        <div className='flex flex-col gap-10' >
            <div className='w-full flex justify-between' >
                <h1 className='text-xl font-bold text-gray-800'>Users Overview</h1>
                
                <PiDotsThreeOutlineVerticalFill className='text-gray-800 text-lg cursor-pointer' />
            </div>

            <div className='w-full h-20 flex justify-between' >
                {/* suppliers */}
                <div className='flex gap-4 hover:scale-105 group cursor-pointer' >
                    <div className='bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center' >
                        <FaRegUser className='text-4xl text-gray-100' />
                    </div>
                    <div className='flex flex-col gap-1' >
                        <h1>Suppliers</h1>
                        <h1 className='text-xl font-bold' >0</h1>
                    </div>
                </div>

                {/* manufacturers */}
                <div className='flex gap-4 hover:scale-105 group cursor-pointer' >
                    <div className='bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center' >
                        <FaRegUser className='text-4xl text-gray-100' />
                    </div>
                    <div className='flex flex-col gap-1' >
                        <h1>Manufacturers</h1>
                        <h1 className='text-xl font-bold' >0</h1>
                    </div>
                </div>

                {/* distributors */}
                <div className='flex gap-4 hover:scale-105 group cursor-pointer' >
                    <div className='bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center' >
                        <FaRegUser className='text-4xl text-gray-100' />
                    </div>
                    <div className='flex flex-col gap-1' >
                        <h1>Distributors</h1>
                        <h1 className='text-xl font-bold' >0</h1>
                    </div>
                </div>

            </div>
            

        </div>
        
    </div>
  )
}
