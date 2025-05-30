"use client";

import React from "react";

export default function ClientOrdersDetails({ data, onClose }) {
  // Check if data is valid
  if (!data || typeof data !== "object" || !data.clientOrder || !data.order) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-5/6 overflow-auto z-50">
        <h2 className="text-2xl font-bold mb-4">Client Order Details</h2>
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

  // Function to format Unix timestamps
  const formatTimestamp = (timestamp) =>
    timestamp && timestamp !== "0"
      ? new Date(Number(timestamp) * 1000).toLocaleString()
      : "N/A";

  // Destructure fields from clientOrder and order
  const {
    clientOrder: {
      id,
      orderId,
      clientName,
      clientAddress,
      clientProductQuantity,
      shouldArriveToClientAt,
      isShippedToClient,
      shippedToClientAt,
      isArrivedToClient,
      deliveredToClientAt,
    },
    order: {
      id: orderIdFromOrder,
      manufacturerAddress,
      isProduced,
      producedAt,
      isShippedToDistributor,
      shippedToDistributorAt,
      distributorAddress,
      isArrivedToDistributor,
      arrivedToDistributorAt,
      productName,
      productQuantity,
      productHash,
      status,
    },
  } = data;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-5/6 overflow-auto z-50">
      <h2 className="text-2xl font-bold mb-4">Client Order Details</h2>

      {/* Client Order Information */}
      <div className="mb-6 px-5 py-4 bg-indigo-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Client Order Information</h3>
        <div className="space-y-2">
          <p><strong>Client Order ID:</strong> {id}</p>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Client Name:</strong> {clientName || "N/A"}</p>
          <p><strong>Client Address:</strong> {clientAddress || "N/A"}</p>
          <p><strong>Quantity Ordered:</strong> {clientProductQuantity}</p>
          <p><strong>Expected Arrival:</strong> {formatTimestamp(shouldArriveToClientAt)}</p>
          <p><strong>Shipped to Client:</strong> {isShippedToClient ? "Yes" : "No"}</p>
          <p><strong>Shipped At:</strong> {formatTimestamp(shippedToClientAt)}</p>
          <p><strong>Arrived to Client:</strong> {isArrivedToClient ? "Yes" : "No"}</p>
          <p><strong>Delivered At:</strong> {formatTimestamp(deliveredToClientAt)}</p>
        </div>
      </div>

      {/* Order Information */}
      <div className="mb-6 px-5 py-4 bg-green-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Order Information</h3>
        <div className="space-y-2">
          <p><strong>Order ID:</strong> {orderIdFromOrder}</p>
          <p><strong>Product Name:</strong> {productName || "N/A"}</p>
          <p><strong>Quantity:</strong> {productQuantity}</p>
          <p className="break-words" ><strong>Product Hash:</strong> {productHash || "N/A"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`${
                status === "Pending Production"
                  ? "text-yellow-300"
                  : status === "Manufactured"
                  ? "text-blue-300"
                  : status === "Shipped to Distributor"
                  ? "text-purple-300"
                  : status === "Arrived to Distributor"
                  ? "text-green-300"
                  : "text-red-300"
              } font-bold`}
            >
              {status}
            </span>
          </p>
          <p><strong>Produced:</strong> {isProduced ? "Yes" : "No"}</p>
          <p><strong>Produced At:</strong> {formatTimestamp(producedAt)}</p>
          <p><strong>Shipped to Distributor:</strong> {isShippedToDistributor ? "Yes" : "No"}</p>
          <p><strong>Shipped At:</strong> {formatTimestamp(shippedToDistributorAt)}</p>
          <p><strong>Arrived to Distributor:</strong> {isArrivedToDistributor ? "Yes" : "No"}</p>
          <p><strong>Arrived At:</strong> {formatTimestamp(arrivedToDistributorAt)}</p>
        </div>
      </div>

      {/* Manufacturer Information */}
      <div className="mb-6 px-5 py-4 bg-blue-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Manufacturer</h3>
        <div className="space-y-2">
          <p><strong>Address:</strong> {manufacturerAddress || "N/A"}</p>
        </div>
      </div>

      {/* Distributor Information */}
      <div className="mb-6 px-5 py-4 bg-purple-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Distributor</h3>
        <div className="space-y-2">
          <p><strong>Address:</strong> {distributorAddress || "N/A"}</p>
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