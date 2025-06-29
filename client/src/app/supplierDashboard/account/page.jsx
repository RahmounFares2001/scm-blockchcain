"use client";

import React from 'react'

// componenets
import SearchBar from '@/app/components/adminDashboard/layouts/SearchBar';

// table


// icons
import { IoIosArrowRoundForward } from "react-icons/io";

// redux
import SupplierAccount from '@/app/components/supplierDashboard/account/SupplierAccount';


export default function page() {


  return (
    <div className='px-10 py-10 flex flex-col gap-5' >
      <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Account Details
      </h1>


      {/* table */}
      <div className='bg-white px-5 py-5 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400' >
        
        <div className='flex justify-start font-bold text-xl' >
          <h1>Account Details</h1>

        </div>
        <SupplierAccount />
      </div>
     

    </div>
  )
}
