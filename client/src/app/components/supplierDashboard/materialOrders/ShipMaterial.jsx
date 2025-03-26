"use client";

import React from "react";
import useShipRawMaterial from "@/app/hooks/suppliers/useShipRawMaterial"; // Adjust path as needed

export default function ShipMaterial({ data: clickedData, onClose }) {
  // Check if clickedData is valid
  if (!clickedData || typeof clickedData !== "object") {
    return <div>No data available or invalid data format.</div>;
  }

  // Destructure order data
  const { id, materialName, quantityOrdered, status, manufacturerName } = clickedData;

  // Use the custom hook
  const { shipRawMaterial, loading, error, success } = useShipRawMaterial();

  // Handle Supply button click
  const handleSupply = async () => {
    await shipRawMaterial(id);
    if (success) {
      onClose(); // Close modal on success
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50">
      <h2 className="text-2xl font-bold mb-4">Ship Material</h2>
      <div className="mb-6 px-5 py-4 bg-blue-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Material Name:</strong> {materialName}</p>
          <p><strong>Quantity Ordered:</strong> {quantityOrdered}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Manufacturer:</strong> {manufacturerName}</p>
        </div>
      </div>

      {/* Feedback Messages */}
      {loading && <p className="text-blue-700">Shipping in progress...</p>}
      {error && <p className="text-red-700">{error}</p>}
      {success && <p className="text-green-700">Order shipped successfully!</p>}

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSupply}
          className={`px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 ${
            loading || status !== "Pending" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || status !== "Pending"}
        >
          Supply
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