"use client";


import React from 'react'

// componenets
import SearchBar from '@/app/components/layouts/SearchBar';
import AddSupplierForm from '@/app/components/suppliers/AddSupplierForm';
import { setUi } from '@/app/globalRedux/features/ui/uiSlice';

// table
import { SuppliersTable } from '@/app/components/suppliers/SuppliersTable';


// icons
import { IoIosArrowRoundForward } from "react-icons/io";

// redux
import { useDispatch } from 'react-redux';


export default function page() {
  const dispatch = useDispatch();


  return (
    <div className='px-10 py-10 flex flex-col gap-5' >
      <h1 className='text-sm flex gap-1 items-center' >
        Dashboard
        <IoIosArrowRoundForward className='text-gary-600' />
        Suppliers
      </h1>

      <div className='w-full flex justify-between items-center' >
        <h1 className='text-xl' >Suppliers</h1>
        <button className='px-10 py-2 border bg-primary hover:bg-green-800 
            text-white font-bold text-sm rounded-lg shadow-md shadow-gray-300'
              onClick={()=> {dispatch(setUi({key: "showAddSupplierForm", value: true}))}}  >Add Supplier</button>
      </div>

      {/* table */}
      <div className='bg-white px-5 py-5 flex flex-col gap-5 rounded-lg
              shadow-lg shadow-gray-400' >
        
        <div className='flex justify-between' >
          <h1>All Suppliers List</h1>

          <SearchBar />          
        </div>
        <SuppliersTable />
      </div>

     

    </div>
  )
}
