"use client";
import AddSupplierForm from '@/app/components/adminDashboard/suppliers/AddSupplierForm';
import React from 'react'

// icons
import { IoIosArrowRoundForward } from 'react-icons/io'

export default function page() {
  return (
    <div className='px-10 py-10 flex flex-col gap-5' >
       <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Add Suppliers
      </h1>

      {/* table */}
      <div className='bg-white px-5 py-5 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400 ' >
        
        <div className='flex justify-between flex-col gap-6' >
          <h1 className='font-bold text-xl' >Add Suppliers</h1>

          <AddSupplierForm />

        </div>
      </div>
        
    </div>
  )
}
