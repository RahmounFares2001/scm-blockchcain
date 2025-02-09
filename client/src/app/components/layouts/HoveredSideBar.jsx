"use client"
import React, { useState } from 'react'

import Link from 'next/link'

// data
import sideBarData from "./sideBarData";

// redux
import { useDispatch, useSelector } from 'react-redux';
import { setUi } from '@/app/globalRedux/features/ui/uiSlice';
import { usePathname } from 'next/navigation';


export default function HoveredSideBar() {

  const dispatch = useDispatch();
  const showSideBar = useSelector((state) => state.ui.showSideBar);

    // pathname current page
    const pathname = usePathname();  // Get current pathname

    // Extract currentPage
    const pagePart = pathname.split("/").find((segment, index, array) => {
      const dashboardIndex = array.indexOf("dashboard");
      return index === dashboardIndex + 1;
    });
 
  
  return (
    <div className={`w-[240px] fixed top-0 bottom-0 left-0 flex flex-col bg-primary`}
      onMouseEnter={() => {dispatch(setUi({key: "showHoveredSideBar", value: true}))}}
      onMouseLeave={() => {dispatch(setUi({key: "showHoveredSideBar", value: false}))}} >

      <div className={`py-5 flex justify-center items-center border-b border-gray-600`} >
        <h1 className='font-bold text-gray-300 text-2xl cursor-pointer' >TracChain</h1>
      </div> 

      
      <div className={`h-full flex flex-col gap-5 pl-7 sidebar overflow-y-auto pb-16`} >
        {sideBarData.map((data, index) => (

          <div className='flex flex-col ' key={index}>
            {(data.title != undefined) && <h1 className='text-gray-500 text-xs my-5' >{data.title}</h1>}

            <Link href={data.href} className={`flex gap-3 items-center cursor-pointer group
                       ${data.activeName === pagePart?.toLowerCase() ? 'text-white' : ''}`} >
              {React.cloneElement(data.icon, { 
                className: `${data.activeName === pagePart?.toLowerCase() ?
                       'text-white' : 'text-gray-400'} text-2xl group-hover:text-white` })}

              {<h1 className={`${data.activeName === pagePart?.toLowerCase() ?
                       'text-white' : 'text-gray-400'} group-hover:text-white`} >{data.name}</h1>}
            </Link>
          </div>

        ))}
      </div>
        
        
        
    </div>
  )
}