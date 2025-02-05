"use client";

import React from 'react'

// components
import SideBar from '../components/layouts/SideBar'
import TopBar from '../components/layouts/TopBar'

// redux
import { useDispatch, useSelector } from 'react-redux';
import HoveredSideBar from '../components/layouts/HoveredSideBar';
import { setUi } from '../globalRedux/features/ui/uiSlice';
import AddSupplierForm from '../components/suppliers/AddSupplierForm';

export default function layout({children}) {
  const dispatch = useDispatch();
  const showSideBar = useSelector((state) => state.ui.showSideBar);
  const showHoveredSideBar = useSelector((state) => state.ui.showHoveredSideBar);

  return (
    <main className='flex relative'  >
    
        {/* side bar */}
        <div className={`${showSideBar ? "w-[240px]" : "w-max" } relative bg-primary`}
          onClick={()=> {dispatch(setUi({key: "dropProfileMenu", value: false}))}} >
          <SideBar />
        </div>
        
        {/* show side bar in hover */}
        {(showHoveredSideBar && !showSideBar) && 
        <div className={`w-[240px] absolute top-0 left-0 z-50 bg-primary`} >
          <HoveredSideBar />
        </div> }
        
        {/* top bar */}
        <div className='flex-1 flex flex-col relative w-full' >
          <div className='h-16 bg-white shadow-xl shadow-black border-b ' >
            <TopBar /> 
          </div>

          <div onClick={()=> {dispatch(setUi({key: "dropProfileMenu", value: false}))}}
              className='h-full bg-gray-100' >
            {children}
          </div>
          
        </div>

         {/* add supplier form  */}
         <AddSupplierForm />
    </main>
  )
}
