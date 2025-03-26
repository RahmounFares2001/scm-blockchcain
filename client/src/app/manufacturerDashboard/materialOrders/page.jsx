"use client";

import React from 'react'

// componenets
import SearchBar from '@/app/components/adminDashboard/layouts/SearchBar';

// table


// icons
import { IoIosArrowRoundForward } from "react-icons/io";

import { MaterialOrdersTable } from '@/app/components/manufacturerDashboard/materialOrders/MaterialOrdersTable';


export default function page() {


  return (
    <div className='h-dvh px-10 py-10 flex flex-col gap-5' >
      <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Material Orders
      </h1>

      <div className='flex items-center' >
          <h1 className='text-xl font-bold' >Material Orders</h1>      
      </div>

      {/* table */}
      <div className='bg-white px-5 py-5 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400' >
        
        <div className='flex justify-between' >
          <h1>All Material Orders List</h1>

          <SearchBar />          
        </div>
        <MaterialOrdersTable />
      </div>
     

    </div>
  )
}
