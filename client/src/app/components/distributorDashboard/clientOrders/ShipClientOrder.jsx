"use client";

import React from "react";

// hooks
import useShipClientOrder from "@/app/hooks/orders/useShipClientOrder";

export default function ShipClientOrder({ data, onClose, fetchOrders }) {
  const { shipClientOrder, loading, error, success } = useShipClientOrder();
  console.log(data.clientOrder.id)
  const handleShip = async () => {
    await shipClientOrder(Number(data.clientOrder.id)); 
    if (success) {
      fetchOrders(); 
      onClose();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50">
      <h2 className="text-2xl font-bold mb-4">Ship Client Order</h2>

      <div className="flex flex-col gap-3 bg-indigo-700 text-white px-5 py-3 rounded-xl" >
        <p className="mb-2">
            <strong>Client Order ID:</strong> {data.clientOrder.id}
        </p>
        <p className="mb-2">
            <strong>Client Name:</strong> {data.clientOrder.clientName}
        </p>
        <p className="mb-2">
            <strong>Product:</strong> {data.order.productName}
        </p>
        <p className="mb-4">
            <strong>Quantity:</strong> {data.clientOrder.clientProductQuantity}
        </p>
      </div>

      <p className="mb-4 mt-4">
        Are you sure you want to ship this order to the client?
      </p>

      {loading && <p className="text-blue-700">Shipping order...</p>}
      {error && <p className="text-red-700">{error}</p>}
      {success && <p className="text-green-700">Order shipped successfully!</p>}

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