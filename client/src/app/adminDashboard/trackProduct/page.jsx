"use client";

import React, { useEffect, useState } from 'react'

// icons
import { IoIosArrowRoundForward } from 'react-icons/io'

export default function page() {

  const [productID, setProductID] = useState("");
  const [showTrackDetails, setShowTrackDetails] = useState(false);

  // handle track
  const handleInputChange = (e) => {
    setProductID(e.target.value)
  }

  const handleTrack = () => {
    setProductID("");
    setShowTrackDetails(true);
  }

  return (
    <div className='px-10 py-10 flex flex-col gap-5' >
      <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Track product
      </h1>

      <div className='bg-white px-10 py-10 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400' >

          {/* product ID input */}
          <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="productID">Product ID</label>
                    <input type="number" name='productID'
                        placeholder='Product ID'
                        onChange={handleInputChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
          </div>

          {/* track button */}
          <button className='w-full py-3 bg-primary hover:bg-primary/90 rounded-lg
                      text-gray-200 font-bold'
                  onClick={()=> {handleTrack()}} >Track</button>
          

          <div className='flex flex-col gap-6 pt-10' > 
            <div className='flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200
                  px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105' >
              <h1>Product Name: ....</h1>
              <h1>Current Stage: ....</h1>
              <h1>Date: ....</h1>
            </div>

            <div className='flex justify-center flex-col gap-3 bg-green-900 text-gray-200
                  px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105' >
              <h1>Production Stage: ....</h1>
              <h1>Date: ....</h1>
            </div>

            <div className='flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200
                  px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105' >
              <h1>Arrive at Distributor: ....</h1>
              <h1>Date: ....</h1>
            </div>
         
            <div className='flex justify-center flex-col gap-3 bg-green-900 text-gray-200
                  px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105' >
              <h1>Stage: Start Shipement: ....</h1>
              <h1>Date: ....</h1>
            </div>
          </div>
      </div>
     
    </div>
  )
}
