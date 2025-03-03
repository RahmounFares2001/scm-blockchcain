"use client";


import React from 'react'

// componenets
import SearchBar from '@/app/components/layouts/SearchBar';
import { ProductOrdersTable } from '@/app/components/productOrders/ProductOrdersTable';

// icons
import { IoIosArrowRoundForward } from "react-icons/io";

// redux
import Link from 'next/link';


export default function page() {


  return (
    <div className='h-dvh px-10 py-10 flex flex-col gap-5' >
      <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Product Orders
      </h1>

      <div className='flex justify-between items-center' >
          <h1 className='text-xl' >Product Orders</h1>      

          <Link href="/adminDashboard/addOrder" >
            <button href='/adminDashboard/manufactories'
                className='px-10 py-2 border bg-primary hover:bg-green-800 
                text-white font-bold text-sm rounded-lg shadow-md shadow-gray-300'   >
                    Add Product Order
          </button>
        </Link>
      </div>

      {/* table */}
      <div className='bg-white px-5 py-5 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400' >
        
        <div className='flex justify-between' >
          <h1>All Product Orders List</h1>

          <SearchBar />          
        </div>
        <ProductOrdersTable />
      </div>
     

    </div>
  )
}
