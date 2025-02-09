"use client";


import Hero from "./components/home/Hero";
import HomeHeader from "./components/home/HomeHeader";
import Features from "./components/home/Features";
import Contact from "./components/home/Contact";
import HomeFooter from "./components/home/HomeFooter";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcProvider } from 'ethers';


export default function Home() {
  
  // const [admin, setAdmin] = useState("");

  // const roleNames = ["ADMIN", "SUPPLIER", "MANUFACTURER", "DISTRIBUTOR"];

  // const fetchAdminData = async () => {
  //   try {
  //     if (typeof window !== "undefined" && window.ethereum) {
  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       const signer = await provider.getSigner();
  //       const transactionsContract = new ethers.Contract(
  //         "0x3e26cecd77a1d721f7968f3fcb7a72926f84ad25",
  //         [
  //           "function users(address) view returns (address userAddress, uint8 role, bool isRegistered)"
  //         ],
  //         signer
  //       );
  
  //       const adminAddress = await signer.getAddress();
  //       const adminData = await transactionsContract.users(adminAddress);
  
  //        // Role mapping
  //        const RoleEnum = {
  //         0: "ADMIN",
  //         1: "SUPPLIER",
  //         2: "MANUFACTURER",
  //         3: "DISTRIBUTOR"
  //       };

  //       const roleString = RoleEnum[Number(adminData.role)] || "UNKNOWN";

  //       console.log("Admin Data:", {
  //         userAddress: adminData.userAddress,
  //         role: roleString,
  //         isRegistered: adminData.isRegistered,
  //       });
  //     } else {
  //       console.error("MetaMask not detected");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching admin data:", error);
  //   }
  // };
  // fetchAdminData();
  
  return (
    <section className="bg-primary" >
    
      {/* <HomeHeader />
      <Hero />
      <Features />
      <Contact />
      <HomeFooter /> */}
    </section>
  );
}
