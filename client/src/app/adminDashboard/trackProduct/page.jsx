"use client";

import React, { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import useGetOrderById from "@/app/hooks/orders/useGetOrderById"; // Adjust path as needed

export default function TrackProduct() {
  const [orderID, setOrderID] = useState("");
  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const { order, loading, error, fetchOrder, reset } = useGetOrderById();

  const handleInputChange = (e) => {
    setOrderID(e.target.value);
    setShowTrackDetails(false); // Hide details when changing ID
  };

  const handleTrack = () => {
    if (orderID && !isNaN(orderID) && Number(orderID) > 0) {
      reset(); // Clear old data before fetching new
      fetchOrder(Number(orderID)); // Fetch order
      setShowTrackDetails(true); // Show details
    } else {
      alert("Please enter a valid Order ID (positive number).");
    }
  };

  const handleRetry = () => {
    reset(); // Clear order and error
    setOrderID(""); // Clear input
    setShowTrackDetails(false); // Hide details
  };

  // Handle invalid ID alert
  React.useEffect(() => {
    if (error === "Invalid Order ID") {
      alert("Invalid Order ID");
      setShowTrackDetails(false); // Hide details on invalid ID
    }
  }, [error]);

  // Date formatting helper function
  const formatDate = (timestamp) =>
    timestamp && timestamp !== "0"
      ? new Date(parseInt(timestamp) * 1000).toLocaleString()
      : "Not Available Yet";

  return (
    <div className={`${!showTrackDetails && "h-dvh"} px-10 py-10 flex flex-col gap-5`}>
      <h1 className="text-sm flex gap-1 items-center">
        Dashboard
        <IoIosArrowRoundForward className="text-gray-600" />
        Track product
      </h1>

      <div className="bg-white px-10 py-10 flex flex-col gap-5 rounded-lg shadow-lg shadow-gray-400">
        {/* Order ID input */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="orderID">Order ID</label>
          <input
            type="number"
            name="orderID"
            placeholder="Order ID"
            value={orderID}
            onChange={handleInputChange}
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg"
          />
        </div>

        <button
          className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg text-gray-200 font-bold"
          onClick={handleTrack}
        >
          Track
        </button>

        {showTrackDetails && order && (
          <div className="flex flex-col gap-6 pt-10">
            {/* Manufacturer & Distributor Details */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Product: {order.productName}</h1>
              <h1>
                Manufacturer: {order.manufacturerName} ({order.manufacturerAddress})
              </h1>
              <h1>
                Distributor: {order.distributorName} ({order.distributorAddress})
              </h1>
            </div>

            {/* Order Status Timeline */}
            <div className="flex justify-center flex-col gap-3 bg-green-900 text-gray-200 px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Current Status: {order.orderStatus}</h1>
              <h1>Created At: {formatDate(order.createdAt)}</h1>
              <h1>Quantity: {order.productQuantity}</h1>
            </div>

            {/* Production Details */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Production: {order.isProduced ? "Completed" : "Pending"}</h1>
              <h1>Date: {formatDate(order.producedAt)}</h1>
            </div>

            {/* Shipping Details */}
            <div className="flex justify-center flex-col gap-3 bg-green-900 text-gray-200 px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Shipped To Distributor: {order.isShippedToDistributor ? "Yes" : "No"}</h1>
              <h1>Date: {formatDate(order.shippedToDistributorAt)}</h1>
            </div>

            {/* Delivery Details */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 rounded-xl h-36 shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Arrived at Distributor: {order.isArrivedToDistributor ? "Yes" : "No"}</h1>
              <h1>Date: {formatDate(order.arrivedToDistributorAt)}</h1>
            </div>
          </div>
        )}

        {loading && <p className="text-center">Loading order details...</p>}
        {error && error !== "Invalid Order ID" && (
          <p className="text-center text-red-500">{error}</p>
        )}
        {error && (
          <button
            className="w-full py-3 bg-yellow-700 hover:bg-yellow-600 rounded-lg text-white font-bold mt-4"
            onClick={handleRetry}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}