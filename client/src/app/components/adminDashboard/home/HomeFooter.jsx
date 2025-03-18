"use client";

import React from 'react'

import {motion} from "framer-motion";

// icons
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGooglePlus } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";


export default function HomeFooter() {
  return (
    <section style={{backgroundColor: "#010101"}}
                className='py-20 flex flex-col gap-10'> 
        <motion.div className='flex justify-center gap-3 sm:gap-10'
                    initial={{opacity: 0, y: '-5vh'}}
                    whileInView={{opacity: 1, y: '0vh'}}
                    transition={{delay: 0.2, duration: 0.6}}
                    viewport={{once: true}}>
            <a href="#"><FaTwitter className='w-10 h-10 sm:w-14 sm:h-14 text-gray-300 hover:text-indigo-700 transition-colors duration-500' /></a>
            <a href="#"><FaFacebook className='w-10 h-10 sm:w-14 sm:h-14 text-gray-300 hover:text-indigo-700 transition-colors duration-500'/></a>
            <a href="#"><FaLinkedin className='w-10 h-10 sm:w-14 sm:h-14 text-gray-300 hover:text-indigo-700 transition-colors duration-500' /></a>
            <a href="#"><FaGooglePlus className='w-10 h-10 sm:w-14 sm:h-14 text-gray-300 hover:text-indigo-700 transition-colors duration-500' /></a>
            <a href="#"><FaYoutube className='w-10 h-10 sm:w-14 sm:h-14 text-gray-300 hover:text-indigo-700 transition-colors duration-500' /></a>
        </motion.div>
        
        <motion.h1 className='text-gray-300 text-center text-sm sm:text-xl'
                  initial={{opacity: 0}}
                  whileInView={{opacity: 1}}
                  transition={{delay: 0.4, duration: 1}}
                  viewport={{once: true}}>2025 © TracChain. All rights reserved.</motion.h1>
    </section>
  )
}