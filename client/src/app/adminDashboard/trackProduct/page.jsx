"use client";

import React, { useState, useEffect } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import useGetOrderDetailsByClientOrderId from "@/app/hooks/orders/useGetOrderDetailsByClientOrderId";
import useClientConfirmDelivery from "@/app/hooks/orders/useClientConfirmDelivery";
import useGetManufacturerByAddress from "@/app/hooks/manufacturers/useGetManufacturerByAddress";
import useFetchDistributorByAddress from "@/app/hooks/distributors/useFetchDistributorByAddress";

export default function TrackProduct() {
  const [orderID, setOrderID] = useState("");
  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const { orderDetails, loading, error: fetchError, fetchOrder, reset } = useGetOrderDetailsByClientOrderId();
  const { clientConfirmDelivery, loading: confirmLoading, error: confirmError, success } = useClientConfirmDelivery();
  const { manufacturer, loading: loadingManufacturer, error: errorManufacturer, fetchManufacturer } = useGetManufacturerByAddress();
  const { fetchDistributorByAddress, distributor, loading: loadingDistributor, error: errorDistributor } = useFetchDistributorByAddress();

  // Handle input change
  const handleInputChange = (e) => {
    setOrderID(e.target.value);
    setShowTrackDetails(false); // Hide details when changing ID
  };

  // Handle tracking
  const handleTrack = () => {
    if (orderID && !isNaN(orderID) && Number(orderID) > 0) {
      reset(); // Clear old data
      fetchOrder(Number(orderID)); // Fetch order details
      setShowTrackDetails(true);
    } else {
      alert("Please enter a valid Order ID (positive number).");
    }
  };

  // Fetch manufacturer and distributor names when orderDetails changes
  useEffect(() => {
    if (orderDetails) {
      const manufacturerAdd = orderDetails?.order.manufacturerAddress;
      const distributorAdd = orderDetails?.order.distributorAddress;
      if (manufacturerAdd) fetchManufacturer(manufacturerAdd);
      if (distributorAdd) fetchDistributorByAddress(distributorAdd);
    }
  }, [orderDetails, fetchManufacturer, fetchDistributorByAddress]);

  // Handle invalid ID alert
  useEffect(() => {
    if (fetchError === "Invalid Order ID") {
      alert("Invalid Order ID");
      setShowTrackDetails(false);
    }
  }, [fetchError]);

  // Confirm delivery handler
  const handleConfirmDelivery = () => {
    clientConfirmDelivery(Number(orderID)).then(() => {
      fetchOrder(Number(orderID)); // Refresh order state
    });
  };

  // Handle close/retry
  const handleClose = () => {
    reset();
    setOrderID("");
    setShowTrackDetails(false);
  };

  // Date formatting helper
  const formatDate = (timestamp) =>
    timestamp && timestamp !== "0"
      ? new Date(Number(timestamp) * 1000).toLocaleString()
      : "Not Available Yet";

  // Get current stage
  const getCurrentStage = () => {
    if (!orderDetails) return "Unknown";
    const { clientOrder, order } = orderDetails;
    return clientOrder.isArrivedToClient
      ? "Arrived at Client"
      : clientOrder.isShippedToClient
      ? "Shipped to Client"
      : order.isArrivedToDistributor
      ? "Arrived to Distributor"
      : order.isShippedToDistributor
      ? "Shipped to Distributor"
      : order.isProduced
      ? "Production"
      : "Pending Production";
  };

  return (
    <div className={`${!showTrackDetails && "h-dvh"} px-10 py-10 flex flex-col gap-5`}>
      <h1 className="text-sm flex gap-1 items-center">
        Dashboard
        <IoIosArrowRoundForward className="text-gray-600" />
        Track product
      </h1>

      <div className="bg-white px-10 py-10 flex flex-col gap-5 rounded-lg shadow-lg shadow-gray-400">
        {/* Order ID input */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="orderID">Order ID</label>
          <input
            type="number"
            name="orderID"
            placeholder="Order ID"
            value={orderID}
            onChange={handleInputChange}
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg"
          />
        </div>

        <button
          className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg text-gray-200 font-bold"
          onClick={handleTrack}
          disabled={loading}
        >
          {loading ? "Tracking..." : "Track"}
        </button>

        {showTrackDetails && orderDetails && (
          <div className="flex flex-col gap-6 pt-10">
            {/* Product Details */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Product: {orderDetails.order.productName}</h1>
              <h1>Order Quantity: {orderDetails.clientOrder.clientProductQuantity}</h1>
              <h1>Product Hash: <span className="text-xs break-words">{orderDetails.order.productHash}</span></h1>
            </div>

            {/* Manufacturer Details */}
            <div className="flex justify-center flex-col gap-3 bg-green-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Manufacturer Name: {manufacturer?.name || (loadingManufacturer ? "Loading..." : "N/A")}</h1>
              <h1>Manufacturing Place: {manufacturer?.place || (loadingManufacturer ? "Loading..." : "N/A")}</h1>
            </div>

            {/* Distributor Details */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Distributor Name: {distributor?.name || (loadingDistributor ? "Loading..." : "N/A")}</h1>
              <h1>Distributor Place: {distributor?.place || (loadingDistributor ? "Loading..." : "N/A")}</h1>
            </div>

            {/* Current Stage */}
            <div className="flex justify-center flex-col gap-3 bg-green-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1>Current Stage: {getCurrentStage()}</h1>
            </div>

            {/* Order History */}
            {/* Production */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1 className="font-bold">Stage 01: Production</h1>
              <h1>Status: {orderDetails.order.isProduced ? "Completed" : "Pending"}</h1>
              <h1>Date: {formatDate(orderDetails.order.producedAt)}</h1>
            </div>

            {/* Shipped to Distributor */}
            <div className="flex justify-center flex-col gap-3 bg-green-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1 className="font-bold">Stage 02: Shipped to Distributor</h1>
              <h1>Status: {orderDetails.order.isShippedToDistributor ? "Completed" : "No"}</h1>
              <h1>Date: {formatDate(orderDetails.order.shippedToDistributorAt)}</h1>
            </div>

            {/* Arrived at Distributor */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1 className="font-bold">Stage 03: Arrived at Distributor</h1>
              <h1>Status: {orderDetails.order.isArrivedToDistributor ? "Completed" : "No"}</h1>
              <h1>Date: {formatDate(orderDetails.order.arrivedToDistributorAt)}</h1>
            </div>

            {/* Shipped to Client */}
            <div className="flex justify-center flex-col gap-3 bg-green-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1 className="font-bold">Stage 04: Shipped to Client</h1>
              <h1>Status: {orderDetails.clientOrder.isShippedToClient ? "Completed" : "No"}</h1>
              <h1>Date: {formatDate(orderDetails.clientOrder.shippedToClientAt)}</h1>
            </div>

            {/* Delivered to Client */}
            <div className="flex justify-center flex-col gap-3 bg-indigo-900 text-gray-200 px-14 py-6 rounded-xl shadow-lg shadow-gray-300 cursor-pointer hover:scale-105">
              <h1 className="font-bold">Stage 05: Delivered to Client</h1>
              <h1>Status: {orderDetails.clientOrder.isArrivedToClient ? "Completed" : "No"}</h1>
              <h1>Date: {formatDate(orderDetails.clientOrder.deliveredToClientAt)}</h1>
            </div>

            {/* Confirm Delivery Button */}
            {!orderDetails.clientOrder.isArrivedToClient && (
              <button
                onClick={handleConfirmDelivery}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold"
                disabled={confirmLoading}
              >
                {confirmLoading ? "Confirming..." : "Confirm Delivery"}
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-full py-3 bg-yellow-700 hover:bg-yellow-600 rounded-lg text-white font-bold"
            >
              Close
            </button>
          </div>
        )}

        {loading && <p className="text-center">Loading order details...</p>}
        {(fetchError || confirmError || errorManufacturer || errorDistributor) && (
          <p className="text-center text-red-500">
            {fetchError || confirmError || errorManufacturer || errorDistributor}
          </p>
        )}
        {(fetchError || confirmError || errorManufacturer || errorDistributor) && (
          <button
            className="w-full py-3 bg-yellow-700 hover:bg-yellow-600 rounded-lg text-white font-bold mt-4"
            onClick={handleClose}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}