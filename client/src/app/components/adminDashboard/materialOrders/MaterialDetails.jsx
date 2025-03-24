"use client";

import React from 'react';

export default function MaterialDetails({ data }) {
  if (!data) {
    return <div className="text-center text-gray-500">No material selected.</div>;
  }

  const { material, supplier } = data;

  return (
    <div className="px-10 py-8 bg-white rounded-lg shadow-md w-1/2 z-50 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Material Details</h2>

      {/* Material Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Material Information</h3>
        <div className="space-y-2 px-5 py-4 bg-indigo-800 text-white rounded-xl">
          <p><strong>ID:</strong> {material.id}</p>
          <p><strong>Name:</strong> {material.name}</p>
          <p><strong>Description:</strong> {material.description}</p>
          <p><strong>Price:</strong> ${material.price}</p>
          <p><strong>Quantity Available:</strong> {material.quantityAvailable}</p>
          <p><strong>Availability:</strong> {material.isAvailable ? "Available" : "Not Available"}</p>
          <p><strong>Last Updated:</strong> {new Date(material.timestamp * 1000).toLocaleString()}</p>
          <p><strong>Review Price Update:</strong> {material.reviewPriceUpdate}</p>
          <p><strong>Update Price Reason:</strong> {material.updatePriceRaison}</p>
          <p><strong>Review Reason:</strong> {material.reviewReason}</p>
          <p><strong>Price Updates:</strong> {material.priceUpdateTimestamps.length}</p>
          <p><strong>Is Deleted:</strong> {material.isDeleted ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Supplier Information</h3>
        <div className="space-y-2 px-5 py-4 bg-green-800 text-white rounded-xl">
          <p><strong>Name:</strong> {supplier.name}</p>
          <p><strong>Address:</strong> {material.supplierAddress}</p>
          <p><strong>Reliability Rating:</strong> {supplier.reliabilityRating}</p>
          <p>
            <strong>Status:</strong>
            <span
              className={`${
                supplier.isFraud === "Fraud"
                  ? "text-red-700"
                  : supplier.isFraud === "Reliable"
                  ? "text-white"
                  : "text-yellow-700"
              } font-bold ml-2`}
            >
              {supplier.isFraud}
            </span>
          </p>
          <p><strong>Place:</strong> {supplier.place}</p>
          <p><strong>Email:</strong> {supplier.emailAddress}</p>
          <p><strong>Is Deleted:</strong> {supplier.isDeleted ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Violations Information */}
      <div className='px-5 py-4 bg-indigo-800 text-white rounded-xl' >
        <h3 className="text-xl font-semibold mb-2">Violations</h3>
        <div className="space-y-2">
          {supplier.violations && Object.keys(supplier.violations).length > 0 ? (
            Object.entries(supplier.violations).map(([key, value], index) => (
              <p key={index}><strong>{key}:</strong> {value.toString()}</p>
            ))
          ) : (
            <p>No violations found.</p>
          )}
        </div>
      </div>
    </div>
  );
}