import React from 'react';

export default function SupplierDetails({ data: clickedData }) {
  // Check if clickedData is valid
  if (!clickedData || typeof clickedData !== 'object') {
    return <div>No data available or invalid data format.</div>;
  }

  // Destructure the supplier and materials from clickedData
  const { supplier, materials } = clickedData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50">
      <h2 className="text-2xl font-bold mb-4">Supplier and Their Raw Materials</h2>

      {/* Supplier Details */}
      <div className="mb-6 px-5 py-4 bg-indigo-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Supplier Information</h3>
        <div className="space-y-2">
          <p><strong>Name:</strong> {supplier.name}</p>
          <p><strong>Address:</strong> {supplier.address}</p>
          <p><strong>Reliability Rating:</strong> {supplier.reliabilityRating}</p>
          <p><strong>Fraud Status:</strong> {supplier.isFraud}</p>
          <p><strong>Place:</strong> {supplier.place}</p>
          <p><strong>Email Address:</strong> {supplier.email}</p>
          <p><strong>Violations:
            <span className='font-normal' >{supplier.violations.length == 0 &&  " No Violations Yet"}</span>
            </strong>
          </p>
          <ul className="list-disc pl-5">
            {Object.entries(supplier.violations).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>        
        </div>
      </div>

      {/* Raw Materials Provided by This Supplier */}
      <h3 className="text-xl font-semibold mt-4 mb-2">Raw Materials Provided</h3>
      {materials.length > 0 ? (
        <div className="space-y-4 px-5 py-4 bg-indigo-800 text-white rounded-xl">
          {materials.map((material) => (
            <div key={material.id} className="border border-gray-200 p-4 rounded-lg">
              <p><strong>Material ID:</strong> {material.id}</p>
              <p><strong>Name:</strong> {material.name}</p>
              <p><strong>Description:</strong> {material.description}</p>
              <p><strong>Price:</strong> ${material.price}</p>
              <p><strong>Quantity Available:</strong> {material.quantityAvailable}</p>
              <p><strong>Is Available:</strong> {material.isAvailable ? "Yes" : "No"}</p>
              <p><strong>Timestamp:</strong> {new Date(material.timestamp * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No raw materials provided by this supplier.</p>
      )}
    </div>
  );
}