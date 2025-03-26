"use client";

import React from "react";

export default function MaterialOrderDetails({ data: clickedData }) {
  // Check if clickedData is valid
  if (!clickedData || typeof clickedData !== "object") {
    return <div>No data available or invalid data format.</div>;
  }

  // Destructure the order data
  const {
    id,
    supplierAddress,
    supplierName,
    manufacturerAddress,
    manufacturerName,
    materialName,
    materialId,
    quantityOrdered,
    quantityReceived,
    price,
    shippedAt,
    shouldArriveAt,
    arrivedAt,
    status,
  } = clickedData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Material Order Details</h2>

      {/* Order Details */}
      <div className="mb-6 px-5 py-4 bg-indigo-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Order Information</h3>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {id}
          </p>
          <p>
            <strong>Material Name:</strong> {materialName}
          </p>
          <p>
            <strong>Material ID:</strong> {materialId}
          </p>
          <p>
            <strong>Quantity Ordered:</strong> {quantityOrdered}
          </p>
          <p>
            <strong>Quantity Received:</strong> {quantityReceived}
          </p>
          <p>
            <strong>Price:</strong> ${price}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`${
                status === "Pending"
                  ? "text-yellow-300"
                  : status === "Shipped"
                  ? "text-blue-300"
                  : status === "Delivered"
                  ? "text-green-300"
                  : "text-red-300"
              } font-bold`}
            >
              {status}
            </span>
          </p>
          <p>
            <strong>Shipped At:</strong> {shippedAt}
          </p>
          <p>
            <strong>Should Arrive At:</strong> {shouldArriveAt}
          </p>
          <p>
            <strong>Arrived At:</strong> {arrivedAt}
          </p>
        </div>
      </div>

      {/* Supplier and Manufacturer Info */}
      <h3 className="text-xl font-semibold mt-4 mb-2">Parties Involved</h3>
      <div className="space-y-4 px-5 py-4 bg-green-800 text-white rounded-xl flex flex-col gap-5">
        <div className="border-b pb-5 flex flex-col gap-2">
          <h4 className="text-lg font-medium">Supplier</h4>
          <p>
            <strong>Name:</strong> {supplierName}
          </p>
          <p>
            <strong>Address:</strong> {supplierAddress}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-medium">Manufacturer</h4>
          <p>
            <strong>Name:</strong> {manufacturerName}
          </p>
          <p>
            <strong>Address:</strong> {manufacturerAddress}
          </p>
        </div>
      </div>
    </div>
  );
}