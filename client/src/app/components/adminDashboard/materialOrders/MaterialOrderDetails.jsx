import React from 'react';

export default function MaterialOrderDetails({ order, onClose }) {
  // Check if order is valid
  if (!order || typeof order !== 'object') {
    return <div>No data available or invalid data format.</div>;
  }

  // Destructure the material order details from order
  const {
    id,
    supplierName,
    manufacturerName,
    materialName,
    quantityOrdered,
    quantityReceived,
    price,
    shippedAt,
    shouldArriveAt,
    arrivedAt,
    status
  } = order;

  const getStatusBadge = (status) => {
        switch (status) {
            case 'Shipped':
                return <span className="text-yellow-600 font-bold">Shipped</span>;
            case 'Delivered':
                return <span className="text-green-600 font-bold">Delivered</span>;
            case 'Canceled':
                return <span className="text-red-600 font-bold">Canceled</span>;
            default:
                return <span className="text-yellow-600 font-bold">Pending</span>;
        }
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50 h-5/6 overflow-auto">



        <h2 className="text-2xl font-bold mb-4">Material Order Details</h2>

        {/* Order Information */}
        <div className="mb-6 px-5 py-4 bg-blue-800 text-white rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Order Information</h3>
          <div className="space-y-2">
            <p><strong>Order ID:</strong> {id}</p>
            <p><strong>Supplier Name:</strong> {supplierName}</p>
            <p><strong>Manufacturer Name:</strong> {manufacturerName}</p>
            <p><strong>Material Name:</strong> {materialName}</p>
            <p><strong>Quantity Ordered:</strong> {quantityOrdered}</p>
            <p><strong>Quantity Received:</strong> {quantityReceived}</p>
            <p><strong>Price:</strong> ${price}</p>
            <p><strong>Shipped At:</strong> {shippedAt}</p>
            <p><strong>Expected Arrival:</strong> {shouldArriveAt}</p>
            <p><strong>Arrived At:</strong> {arrivedAt || "Not yet arrived"}</p>
            <p><strong>Status:</strong> {getStatusBadge(status)}</p>
          </div>
        </div>
    </div>
  );
}
