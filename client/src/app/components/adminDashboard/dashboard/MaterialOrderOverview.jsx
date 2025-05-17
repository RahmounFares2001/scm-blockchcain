"use client"
import React from "react";

// Icons
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { LuClock6 } from "react-icons/lu";
import { PiFactoryLight } from "react-icons/pi";
import { DiStreamline } from "react-icons/di";
import { LiaShippingFastSolid } from "react-icons/lia";

// Custom Hook
import useGetMaterialOrderStatistics from "@/app/hooks/adminDashboard/useGetMaterialOrderStatistics";


export default function MaterialOrderOverview() {
  const {
    pendingCount,
    shippedToManufacturerCount,
    arrivedToManufacturerCount,
    canceledCount,
    loading,
    error,
  } = useGetMaterialOrderStatistics();

  // total orders
  const totalOrders = pendingCount +
    shippedToManufacturerCount +
    arrivedToManufacturerCount +
    canceledCount;

  if (loading) return <p>Loading material orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-8 py-5 w-full bg-white rounded-xl shadow-md shadow-gray-300">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="w-full flex justify-between">
          <h1 className="text-xl font-bold text-gray-800">Raw Materials Orders</h1>
          <PiDotsThreeOutlineVerticalFill className="text-gray-800 text-lg cursor-pointer" />
        </div>

        {/* Statistics */}
        <div className="w-full flex flex-col gap-10">
          {/* Pending */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center">
              <LuClock6 className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Pending</h1>
              <h1 className="text-xl font-bold">{pendingCount}</h1>
            </div>
          </div>

          {/* Shipped to Manufacturer */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center">
              <LiaShippingFastSolid className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Shipped to Manufacturer</h1>
              <h1 className="text-xl font-bold">{shippedToManufacturerCount}</h1>
            </div>
          </div>

          {/* Arrived to Manufacturer */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center">
              <PiFactoryLight className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Arrived to Manufacturer</h1>
              <h1 className="text-xl font-bold">{arrivedToManufacturerCount}</h1>
            </div>
          </div>

          {/* Canceled */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-green-800 shadow-md shadow-green-800 group-hover:bg-green-900 w-16 h-16 rounded-xl flex justify-center items-center">
              <DiStreamline className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Canceled</h1>
              <h1 className="text-xl font-bold">{canceledCount}</h1>
            </div>
          </div>

          {/* Total Orders */}
          <div className="w-full h-40 bg-green-800 rounded-xl flex flex-col gap-5 justify-center items-center shadow-md shadow-green-800 text-white cursor-pointer hover:scale-105">
            <h1 className="text-xl font-bold">All Raw Material Orders</h1>
            <h1 className="text-3xl font-bold">{totalOrders}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}