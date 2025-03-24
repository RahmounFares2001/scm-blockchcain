"use client";

import Image from 'next/image';
import React from 'react'

// icons 
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";



// redux
import { useDispatch, useSelector } from 'react-redux';
  import { setUi } from '../../../globalRedux/features/ui/uiSlice';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const dispatch = useDispatch();
  const showSideBar = useSelector((state) => state.ui.showSideBar);
  const dropProfileMenu = useSelector((state) => state.ui.dropProfileMenu);

    // logout
    const router = useRouter();
    const logout = async () => {
      try {
        await ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        router.push('/');
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
  return (
    <div className=' flex px-4 items-center h-full justify-between' >

      {showSideBar ? 
        <FiMenu className='text-gray-700 text-2xl cursor-pointer'
          onClick={() => dispatch(setUi({ key: "showSideBar", value: false }))} 
        /> :
        <IoMdClose className='text-gray-700 text-2xl cursor-pointer'
          onClick={() => dispatch(setUi({ key: "showSideBar", value: true }))} 
        />
      }

      
      <div className='flex gap-5 items-center' >
        <div className='px-1 py-1 border rounded-xl' >
        <IoNotificationsOutline className='text-xl text-gray-500 cursor-pointer' /></div>

        <Image width={500} height={500}  alt='profile'
                    src="/userPic.png" 
                    className='w-8 cursor-pointer'
                    onClick={()=> {dispatch(setUi({key: "dropProfileMenu", value: !dropProfileMenu}))}} />
          {/* drop menu */}
          {dropProfileMenu && 
          <div className='absolute top-16 right-3 h-max w-28 bg-white
                flex flex-col border shadow-lg shadow-gray-400' >
            <h1 className='text-black text-center py-3' >Admin</h1>
            <hr />
            <div className='flex gap-2 px-3 py-2 cursor-pointer bg-gray-100'
                onClick={logout} >
              <IoLogOutOutline className='text-xl text-gray-800' />
              <h1 className='text-gray-800 text-sm' >Log Out</h1>
            </div>
          </div> }
      </div>
      
    </div>
  )
}
