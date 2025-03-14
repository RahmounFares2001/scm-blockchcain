"use client";

import Image from 'next/image'
import React, { useState } from 'react'

import {motion} from "framer-motion";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createEthereumContract } from '@/app/utils/constants';

export default function Hero() {
  const router = useRouter();

  // connect to wallet
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      const userAddress = accounts[0];
      setCurrentAccount(accounts[0]);

      // Get user role from the smart contract
      const contract = await createEthereumContract("DataStructures");
      const user = await contract.getUser(userAddress);
      const userRole = user.role; 
      const userisRegistered = user.isRegistered; 

      console.log("User role:", userRole);
      console.log("userisRegistered:", userisRegistered);

      if (userRole === 0n) { // Role.ADMIN
        router.push('/adminDashboard');
      } else if (userRole === 1n) { // Role.SUPPLIER
          router.push('/supplierDashboard');
      } else if (userRole === 2n) { // Role.MANUFACTURER
          router.push('/manufacturerDashboard');
      } else if (userRole === 3n) { // Role.DISTRIBUTOR
          router.push('/distributorDashboard');
      } else {
          alert("Unknown role or unregistered user.");
      }


      // window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  return (
    <section className='text-gray-300 flex gap-20 xl:gap-32 pt-20 lg:pt-14 justify-center items-center lg:pb-24 md:pb-40 pb-52' >

      {/* left */}
      <div className='flex flex-col gap-8 sm:gap-14 lg:gap-7 justify-center'>
        <motion.div className='flex flex-col gap-2 xl:text-6xl md:text-5xl sm:text-5xl text-3xl font-bold'
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.4, duration: 0.2}}>
          <h1 className='text-center'>Transparent & Secure</h1>
          <h1 className='text-center lg:text-start'>Supply Chain .</h1> 
        </motion.div>

        <motion.div className='flex justify-center lg:justify-start w-full'
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.4, duration: 0.2}}>
          <p className='lg:w-96 w-4/5 text-center lg:text-start'>Enhance product traceability and transparency with blockchain-powered supply chain management, ensuring security, efficiency, and trust in every transaction.</p>
        </motion.div>

        {/* buttons */}
        <div className='text-2xl flex flex-col sm:flex-row gap-5 justify-center lg:justify-start w-full px-10 sm:px-0'>

          <motion.button className='border-2 border-black bg-black  px-10 py-2 rounded-sm
              hover:text-black hover:bg-gray-400'
                  initial={{opacity: 0, x: '-10vw'}}
                  animate={{opacity: 1, x: '0vw'}}
                  transition={{delay: 0.7, duration: 0.2}}
                  onClick={()=> {connectWallet()}} >

                    Actor ( Connect to wallet )

          </motion.button>

          <motion.button className='border-2 border-gray-300  px-10 py-2 rounded-sm 
              hover:text-black hover:bg-gray-400'
                  initial={{opacity: 0, x: '-10vw'}}
                  animate={{opacity: 1, x: '0vw'}}
                  transition={{delay: 0.9, duration: 0.2}}>

                    <Link href='/clientPage' >Client</Link>

          </motion.button>

        </div>
      </div>

      {/* right img */}
      <motion.div
            className='hidden lg:block'
            initial={{opacity: 0, x: '50vw'}}
            animate={{opacity: 1, x: '0vw'}}
            transition={{delay: 0.6, duration: 0.3}}>
        <Image width={600} height={600} src="/homePage/homePic.png" alt="logo" 
          className='w-96'/>
      </motion.div>
      
        
    </section>
  )
}