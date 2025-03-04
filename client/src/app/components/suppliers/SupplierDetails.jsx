import React from 'react';

export default function SupplierDetails({ data: clickedData }) {
  if (!clickedData || clickedData.length === 0) {
    return <div>No data available.</div>;
  }

  // Group materials by supplier
  const supplierMaterialsMap = clickedData.reduce((acc, item) => {
    const supplierAddress = item.material.supplierAddress;
    if (!acc[supplierAddress]) {
      acc[supplierAddress] = {
        supplier: item.supplier,
        materials: [],
      };
    }
    acc[supplierAddress].materials.push(item.material);
    return acc;
  }, {});

  // Convert the map to array of suppliers with their materials
  const suppliersWithMaterials = Object.values(supplierMaterialsMap);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-4">Suppliers and Their Raw Materials</h2>

      {suppliersWithMaterials.map((supplierData, index) => (
        <div key={index} className="mb-6">
          {/* Supplier Details */}
          <h3 className="text-xl font-semibold mb-2">Supplier Information</h3>
          <div className="space-y-2">
            <p><strong>Name:</strong> {supplierData.supplier.name}</p>
            <p><strong>Address:</strong> {supplierData.supplier.supplierAddress}</p>
            <p><strong>Reliability Rating:</strong> {supplierData.supplier.reliabilityRating}</p>
            <p><strong>Fraud Status:</strong> {supplierData.supplier.isFraud}</p>
            <p><strong>Place:</strong> {supplierData.supplier.place}</p>
            <p><strong>Email Address:</strong> {supplierData.supplier.emailAddress}</p>
            <p><strong>Violations:</strong> {supplierData.supplier.violations}</p>
            <p><strong>Is Deleted:</strong> {supplierData.supplier.isDeleted ? "Yes" : "No"}</p>
          </div>

          {/* Raw Materials Provided by This Supplier */}
          <h3 className="text-xl font-semibold mt-4 mb-2">Raw Materials Provided</h3>
          {supplierData.materials.length > 0 ? (
            <div className="space-y-4">
              {supplierData.materials.map((material) => (
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
      ))}
    </div>
  );
}