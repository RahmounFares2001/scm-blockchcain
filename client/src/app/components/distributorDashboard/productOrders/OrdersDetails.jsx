"use client";

import React from "react";

export default function OrdersDetails({ data, onClose }) {
  // Check if data is valid
  if (!data || typeof data !== "object") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-4/5 overflow-auto z-50">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <p>No data available or invalid data format.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    );
  }

  // Destructure all fields from the order data
  const {
    id,
    manufacturerAddress,
    manufacturerName,
    distributorAddress,
    productName,
    productQuantity,
    productHash,
    orderStatus,
    isProduced,
    producedAt,
    isShippedToDistributor,
    shippedToDistributorAt,
    isArrivedToDistributor,
    arrivedToDistributorAt,
  } = data;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-4/5 overflow-auto z-50">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      {/* Order Information */}
      <div className="mb-6 px-5 py-4 bg-indigo-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Order Information</h3>
        <div className="space-y-2">
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Product Name:</strong> {productName}</p>
          <p><strong>Quantity:</strong> {productQuantity}</p>
          <p><strong>Product Hash:</strong> {productHash || "N/A"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`${
                orderStatus === "Pending Production"
                  ? "text-yellow-300"
                  : orderStatus === "Manufactured"
                  ? "text-blue-300"
                  : orderStatus === "Shipped to Distributor"
                  ? "text-purple-300"
                  : orderStatus === "Arrived to Distributor"
                  ? "text-green-300"
                  : "text-red-300"
              } font-bold`}
            >
              {orderStatus}
            </span>
          </p>
          <p><strong>Produced:</strong> {isProduced ? "Yes" : "No"}</p>
          <p><strong>Produced At:</strong> {producedAt}</p>
          <p><strong>Shipped to Distributor:</strong> {isShippedToDistributor ? "Yes" : "No"}</p>
          <p><strong>Shipped At:</strong> {shippedToDistributorAt}</p>
          <p><strong>Arrived to Distributor:</strong> {isArrivedToDistributor ? "Yes" : "No"}</p>
          <p><strong>Arrived At:</strong> {arrivedToDistributorAt}</p>
        </div>
      </div>

      {/* Manufacturer Information */}
      <div className="mb-6 px-5 py-4 bg-green-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Manufacturer</h3>
        <div className="space-y-2">
          <p><strong>Name:</strong> {manufacturerName}</p>
          <p><strong>Address:</strong> {manufacturerAddress}</p>
        </div>
      </div>

      {/* Distributor Information */}
      <div className="mb-6 px-5 py-4 bg-blue-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Distributor</h3>
        <div className="space-y-2">
          <p><strong>Address:</strong> {distributorAddress}</p>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}