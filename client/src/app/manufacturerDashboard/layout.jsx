"use client";

import React from 'react'

// components
import TopBar from '../components/adminDashboard/layouts/TopBar'

// redux
import { useDispatch, useSelector } from 'react-redux';
import HoveredSideBar from '../components/adminDashboard/layouts/HoveredSideBar';
import { setUi } from '../globalRedux/features/ui/uiSlice';
import SideBar from '../components/manufacturerDashboard/layouts/SideBar';

export default function layout({children}) {
  const dispatch = useDispatch();
  const showSideBar = useSelector((state) => state.ui.showSideBar);
  const showHoveredSideBar = useSelector((state) => state.ui.showHoveredSideBar);

  return (
    <main className='flex relative h-full'  >
    
        {/* side bar */}
        <div className={`${showSideBar ? "w-[240px]" : "w-max" } overflow-y-auto bg-primary `}
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
              className='bg-gray-100' >
            {children}
          </div>
          
        </div>

    </main>
  )
}
