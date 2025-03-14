"use client"
import React from "react";

// Icons
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { LuClock6 } from "react-icons/lu";
import { PiFactoryLight } from "react-icons/pi";
import { DiStreamline } from "react-icons/di";
import { GrCompliance } from "react-icons/gr";
import { LiaShippingFastSolid } from "react-icons/lia";

// Custom Hook
import useGetOrdersStatistics from "@/app/hooks/adminDashboard/useGetOrdersStatistics";


export default function OrderOverview() {
  const {
    pendingProductionCount,
    manufacturedCount,
    shippedToDistributorCount,
    arrivedToDistributorCount,
    shippedToClientCount,
    deliveredToClientCount,
    loading,
    error,
  } = useGetOrdersStatistics();

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-8 py-5 w-full bg-white rounded-xl shadow-md shadow-gray-300">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="w-full flex justify-between">
          <h1 className="text-xl font-bold text-gray-800">Orders</h1>
          <PiDotsThreeOutlineVerticalFill className="text-gray-800 text-lg cursor-pointer" />
        </div>

        {/* Statistics */}
        <div className="w-full flex flex-col gap-10">
          {/* Pending Production */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <LuClock6 className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Pending Production</h1>
              <h1 className="text-xl font-bold">{pendingProductionCount}</h1>
            </div>
          </div>

          {/* Manufactured */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <PiFactoryLight className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Manufactured</h1>
              <h1 className="text-xl font-bold">{manufacturedCount}</h1>
            </div>
          </div>

          {/* Shipped to Distributor */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <LiaShippingFastSolid className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Shipped to Distributor</h1>
              <h1 className="text-xl font-bold">{shippedToDistributorCount}</h1>
            </div>
          </div>

          {/* Arrived to Distributor */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <DiStreamline className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Arrived to Distributor</h1>
              <h1 className="text-xl font-bold">{arrivedToDistributorCount}</h1>
            </div>
          </div>

          {/* Shipped to Client */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <LiaShippingFastSolid className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Shipped to Client</h1>
              <h1 className="text-xl font-bold">{shippedToClientCount}</h1>
            </div>
          </div>

          {/* Delivered to Client */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <GrCompliance className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Delivered to Client</h1>
              <h1 className="text-xl font-bold">{deliveredToClientCount}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}