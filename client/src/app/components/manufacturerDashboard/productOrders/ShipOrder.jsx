"use client";

import React from "react";

// hooks 
import useShipProductToDistributor from "@/app/hooks/orders/useShipProductToDistributor";

export default function ShipOrder({ data, onClose }) {
  const { shipProductToDistributor, loading, error, success } = useShipProductToDistributor();

  // Check if data is valid
  if (!data || typeof data !== "object") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50">
        <h2 className="text-2xl font-bold mb-4">Ship Order</h2>
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

  // Destructure relevant order data
  const { id, productName, productQuantity, orderStatus } = data;

  // Handle ship action
  const handleShip = async () => {
    await shipProductToDistributor(id); 
    if (success) {
      onClose(); 
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50">
      <h2 className="text-2xl font-bold mb-4">Ship Order</h2>

      {/* Order Summary */}
      <div className="mb-6 px-5 py-4 bg-indigo-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Product Name:</strong> {productName}</p>
          <p><strong>Quantity:</strong> {productQuantity}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`${
                orderStatus === "Manufactured" ? "text-blue-300" : "text-red-300"
              } font-bold`}
            >
              {orderStatus}
            </span>
          </p>
        </div>
      </div>

      {/* Feedback Messages */}
      {loading && <p className="text-blue-700 mb-4">Shipping order...</p>}
      {error && <p className="text-red-700 mb-4">{error}</p>}
      {success && <p className="text-green-700 mb-4">Order shipped successfully!</p>}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleShip}
          className={`px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          Ship
        </button>
        <button
          onClick={onClose}
          className={`px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}