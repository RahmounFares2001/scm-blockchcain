import React from 'react'


// icons
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

import { LuClock6 } from "react-icons/lu";
import { PiFactoryLight } from "react-icons/pi";
import { DiStreamline } from "react-icons/di";
import { GrCompliance } from "react-icons/gr";

// shipped icon
import { LiaShippingFastSolid } from "react-icons/lia";


export default function MaterialOrederOverview() {
  return (
    <div className='px-8 py-5 w-full bg-white rounded-xl shadow-md shadow-gray-300' >
        <div className='flex flex-col gap-10' >
            <div className='w-full flex justify-between' >
                <h1 className='text-xl font-bold text-gray-800'>Raw Materials Orders</h1>
                
                <PiDotsThreeOutlineVerticalFill className='text-gray-800 text-lg cursor-pointer' />
            </div>

            <div className='w-full flex flex-col gap-10' >
                {/* Pending  */}
                <div className='flex gap-4 hover:scale-105 group cursor-pointer' >
                    <div className='bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center' >
                        <LuClock6 className='text-4xl text-gray-100' />
                    </div>
                    <div className='flex flex-col gap-1' >
                        <h1>Pending</h1>
                        <h1 className='text-xl font-bold' >0</h1>
                    </div>
                </div>

                {/* Shipped to Manufacturer */}
                <div className='flex gap-4 hover:scale-105 group cursor-pointer' >
                    <div className='bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center' >
                        <LiaShippingFastSolid className='text-4xl text-gray-100' />
                    </div>
                    <div className='flex flex-col gap-1' >
                        <h1>Shipped to Manufacturer</h1>
                        <h1 className='text-xl font-bold' >0</h1>
                    </div>
                </div>


                {/* Arrived To Manufactured */}
                <div className='flex gap-4 hover:scale-105 group cursor-pointer' >
                    <div className='bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center' >
                        <PiFactoryLight className='text-4xl text-gray-100' />
                    </div>
                    <div className='flex flex-col gap-1' >
                        <h1>Arrived To Manufactured</h1>
                        <h1 className='text-xl font-bold' >0</h1>
                    </div>
                </div>


                {/* Canceled */}
                <div className='flex gap-4 hover:scale-105 group cursor-pointer' >
                    <div className='bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center' >
                        <DiStreamline className='text-4xl text-gray-100' />
                    </div>
                    <div className='flex flex-col gap-1' >
                        <h1>Canceled</h1>
                        <h1 className='text-xl font-bold' >0</h1>
                    </div>
                </div>


                <div className='w-full h-40 bg-green-800 rounded-xl
                            flex flex-col gap-5 justify-center items-center
                            shadow-md shadow-green-800 text-white cursor-pointer hover:scale-105' >
                    <h1 className='text-xl font-bold' >All Row Material Orders</h1>
                    <h1 className='text-3xl font-bold' >0</h1>

                </div>


            </div>
            

        </div>
        
    </div>
  )
}
