"use client";

import Image from 'next/image';
import React from 'react'

// icons 
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";


// redux
import { useDispatch, useSelector } from 'react-redux';
  import { setUi } from '../../../globalRedux/features/ui/uiSlice';

export default function TopBar() {
  const dispatch = useDispatch();
  const showSideBar = useSelector((state) => state.ui.showSideBar);

  return (
    <div className='flex px-4 items-center h-full justify-between' >

      {showSideBar ? 
        <FiMenu className='text-gray-700 text-2xl cursor-pointer'
          onClick={() => dispatch(setUi({ key: "showSideBar", value: false }))} 
        /> :
        <IoMdClose className='text-gray-700 text-2xl cursor-pointer'
          onClick={() => dispatch(setUi({ key: "showSideBar", value: true }))} 
        />
      }

      
      <Image width={500} height={500}  alt='profile'
            src="/userPic.png" 
            className='w-10 cursor-pointer' />
    </div>
  )
}
