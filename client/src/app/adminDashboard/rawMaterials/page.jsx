"use client";


import React from 'react'

// componenets
import SearchBar from '@/app/components/layouts/SearchBar';
import { setUi } from '@/app/globalRedux/features/ui/uiSlice';

// table


// icons
import { IoIosArrowRoundForward } from "react-icons/io";

// redux
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { RawMaterialsTable } from '@/app/components/suppliers/RawMaterialsTable';


export default function page() {
  const dispatch = useDispatch();


  return (
    <div className='h-dvh px-10 py-10 flex flex-col gap-5' >
      <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Raw Materials
      </h1>

      <Link href="/adminDashboard/addSupplier" 
          className='w-full flex justify-between items-center' >
        <h1 className='text-xl' >Materials</h1>

      </Link>

      {/* table */}
      <div className='bg-white px-5 py-5 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400' >
        
        <div className='flex justify-between' >
          <h1>All Materials List</h1>

          <SearchBar />          
        </div>
        <RawMaterialsTable />
      </div>
     

    </div>
  )
}
