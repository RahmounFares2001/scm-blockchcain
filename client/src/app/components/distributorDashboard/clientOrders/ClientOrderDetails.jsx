"use client";

import React from 'react';

export default function ClientOrderDetails({ data }) {
  
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };
  if (!data || typeof data !== 'object') {
    return <div>No order data available</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      {/* Client Order Details */}
      <div className="mb-6 px-5 py-4 bg-blue-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Client Information</h3>
        <div className="space-y-2">
          <p><strong>Order ID:</strong> {data.clientOrder.id}</p>
          <p><strong>Client Name:</strong> {data.clientOrder.clientName}</p>
          <p><strong>Address:</strong> {data.clientOrder.clientAddress}</p>
          <p><strong>Quantity:</strong> {data.clientOrder.clientProductQuantity}</p>
          <p><strong>Expected Arrival:</strong> {formatDate(data.clientOrder.shouldArriveToClientAt)}</p>
          <p><strong>Shipped:</strong> {data.clientOrder.isShippedToClient ? "Yes" : "No"}</p>
          <p><strong>Shipped At:</strong> {formatDate(data.clientOrder.shippedToClientAt)}</p>
          <p><strong>Delivered:</strong> {data.clientOrder.isArrivedToClient ? "Yes" : "No"}</p>
          <p><strong>Delivery Date:</strong> {formatDate(data.clientOrder.deliveredToClientAt)}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="mt-6 px-5 py-4 bg-green-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Order Information</h3>
        <div className="space-y-2">
          <p><strong>Product Name:</strong> {data.order.productName}</p>
          <p><strong>Total Quantity:</strong> {data.order.productQuantity}</p>
          <p><strong>Manufacturer:</strong> {data.order.manufacturerAddress}</p>
          <p><strong>Production Status:</strong> {data.order.isProduced ? "Completed" : "Pending"}</p>
          <p><strong>Production Date:</strong> {formatDate(data.order.producedAt)}</p>
          <p><strong>Shipping Status:</strong> {data.order.isShippedToDistributor ? "Shipped" : "Pending"}</p>
          <p><strong>Shipping Date:</strong> {formatDate(data.order.shippedToDistributorAt)}</p>
          <p><strong>Arrival Status:</strong> {data.order.isArrivedToDistributor ? "Arrived" : "Pending"}</p>
          <p><strong>Arrival Date:</strong> {formatDate(data.order.arrivedToDistributorAt)}</p>
        </div>
      </div>
    </div>
  );
}