"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";

// hooks
import useShipClientOrder from "@/app/hooks/orders/useShipClientOrder";
import useGetOrderById from "@/app/hooks/orders/useGetOrderById";

export default function ShipClientOrder({ data, onClose, fetchOrders }) {
  const { shipClientOrder, loading, error, success } = useShipClientOrder();
  const { order, fetchOrder, loading: orderLoading, error: orderError } = useGetOrderById();
  const [qrError, setQrError] = useState(null);

  // Check if data is valid
  if (!data || typeof data !== "object" || !data.clientOrder || !data.order) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50">
        <h2 className="text-2xl font-bold mb-4">Ship Client Order</h2>
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

  const { clientOrder, order: orderData } = data;

  // Generate and download QR code
  const generateAndDownloadQRCode = async (productHash, clientOrderId) => {
    try {
      const qrData = JSON.stringify({
        productHash: productHash.toString(),
        clientOrderId: clientOrderId.toString(),
      });
      console.log("Generating QR code with data:", qrData);

      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
      });

      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `client_order_${clientOrderId}_qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("QR code download triggered");
    } catch (err) {
      console.error("Error generating QR code:", err);
      setQrError("Failed to generate QR code.");
    }
  };

  // Handle ship action
  const handleShip = async () => {
    try {
      console.log("Shipping client order ID:", clientOrder.id);
      await shipClientOrder(Number(clientOrder.id));
    } catch (err) {
      console.error("Shipping error:", err);
    }
  };

  // Fetch order after successful shipping
  useEffect(() => {
    if (success) {
      console.log("Success detected, fetching order for orderId:", clientOrder.orderId);
      fetchOrder(clientOrder.orderId);
    }
  }, [success, clientOrder.orderId, fetchOrder]);

  // Generate QR code when order is fetched
  useEffect(() => {
    if (order && order.productHash) {
      console.log("Order fetched, productHash:", order.productHash);
      generateAndDownloadQRCode(order.productHash, clientOrder.id).then(() => {
        fetchOrders();
        onClose();
      });
    }
  }, [order, clientOrder.id, fetchOrders, onClose]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50">
      <h2 className="text-2xl font-bold mb-4">Ship Client Order</h2>

      <div className="flex flex-col gap-3 bg-indigo-700 text-white px-5 py-3 rounded-xl">
        <p className="mb-2">
          <strong>Client Order ID:</strong> {clientOrder.id}
        </p>
        <p className="mb-2">
          <strong>Client Name:</strong> {clientOrder.clientName}
        </p>
        <p className="mb-2">
          <strong>Product:</strong> {orderData.productName}
        </p>
        <p className="mb-4">
          <strong>Quantity:</strong> {clientOrder.clientProductQuantity}
        </p>
      </div>

      <p className="mb-4 mt-4">
        Are you sure you want to ship this order to the client?
      </p>

      {loading || orderLoading ? <p className="text-blue-700 mb-4">Shipping order...</p> : null}
      {error && <p className="text-red-700 mb-4">{error}</p>}
      {orderError && <p className="text-red-700 mb-4">{orderError}</p>}
      {qrError && <p className="text-red-700 mb-4">{qrError}</p>}
      {success && order && order.productHash && (
        <p className="text-green-700 mb-4">Order shipped successfully! QR code downloaded.</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={handleShip}
          className={`px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 ${
            loading || orderLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || orderLoading}
        >
          Ship
        </button>
        <button
          onClick={onClose}
          className={`px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 ${
            loading || orderLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || orderLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}