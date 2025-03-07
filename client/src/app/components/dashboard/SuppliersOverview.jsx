import React from "react";

// Icons
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import { BsExclamationOctagon } from "react-icons/bs";

// Custom Hook
import useGetSupplierStatistics from "@/app/hooks/adminDashboard/useGetSupplierStatistics";


export default function SuppliersOverview() {
  const {
    fraudCount,
    reliableCount,
    underReviewCount,
    loading,
    error,
  } = useGetSupplierStatistics();

  if (loading) return <p>Loading supplier statistics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-14 py-6 w-full bg-white rounded-xl shadow-md shadow-gray-300">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="w-full flex justify-between">
          <h1 className="text-xl font-bold text-gray-800">Suppliers</h1>
          <PiDotsThreeOutlineVerticalFill className="text-gray-800 text-lg cursor-pointer" />
        </div>

        {/* Statistics */}
        <div className="w-full h-20 flex justify-between">
          {/* Reliable */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <MdOutlineDone className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Reliable</h1>
              <h1 className="text-xl font-bold">{reliableCount}</h1>
            </div>
          </div>

          {/* Fraud */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <MdOutlineDoNotDisturbAlt className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Fraud</h1>
              <h1 className="text-xl font-bold">{fraudCount}</h1>
            </div>
          </div>

          {/* Under Review */}
          <div className="flex gap-4 hover:scale-105 group cursor-pointer">
            <div className="bg-indigo-800 shadow-md shadow-indigo-700 group-hover:bg-indigo-800 w-16 h-16 rounded-xl flex justify-center items-center">
              <BsExclamationOctagon className="text-4xl text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Under Review</h1>
              <h1 className="text-xl font-bold">{underReviewCount}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}