"use client";


import React from 'react'

// componenets
import SearchBar from '@/app/components/adminDashboard/layouts/SearchBar';
import { DistributorsTable } from '@/app/components/adminDashboard/distributors/DistributorsTable';

// icons
import { IoIosArrowRoundForward } from "react-icons/io";

// redux
import { useDispatch } from 'react-redux';
import Link from 'next/link';


export default function page() {
  const dispatch = useDispatch();


  return (
    <div className='h-dvh px-10 py-10 flex flex-col gap-5' >
      <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Distributors
      </h1>

      <div className='flex justify-between items-center' >
          <h1 className='text-xl' >Distributors</h1>      

          <Link href="/adminDashboard/addDistributors" >
            <button href='/adminDashboard/manufactories'
                className='px-10 py-2 border bg-primary hover:bg-green-800 
                text-white font-bold text-sm rounded-lg shadow-md shadow-gray-300'   >
                    Add Distributor
          </button>
        </Link>
      </div>

      {/* table */}
      <div className='bg-white px-5 py-5 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400' >
        
        <div className='flex justify-between' >
          <h1>All Distributors List</h1>

          <SearchBar />          
        </div>
        <DistributorsTable />
      </div>
     

    </div>
  )
}
