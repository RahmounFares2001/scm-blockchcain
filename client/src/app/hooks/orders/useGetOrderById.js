"use client";

import { useState } from "react";
import { createClientEthereumContract } from "@/app/utils/constants";

export default function useGetOrderById() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async (orderId) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      if (!orderId || isNaN(orderId) || orderId <= 0) {
        throw new Error("Invalid Order ID provided.");
      }
      setLoading(true);
      setError(null);

      const contract = await createClientEthereumContract("OrderManagement");
      if (!contract) {
        throw new Error("Error connecting to the contract");
      }

      const data = await contract.getOrderByOrderId(orderId);
      // Check if data is valid
      if (!data || typeof data !== "object") {
        throw new Error("Order not found or invalid data returned.");
      }

      // Fallback for undefined fields
      const formattedOrder = {
        id: data.id ? data.id.toString() : "N/A",
        manufacturerAddress: data.manufacturerAddress || "Unknown",
        // manufacturerName: data.manufacturerName || "Unknown",
        isProduced: data.isProduced || false,
        producedAt: data.producedAt ? data.producedAt.toString() : "0",
        isShippedToDistributor: data.isShippedToDistributor || false,
        shippedToDistributorAt: data.shippedToDistributorAt ? data.shippedToDistributorAt.toString() : "0",
        distributorAddress: data.distributorAddress || "Unknown",
        // distributorName: data.distributorName || "Unknown",
        isArrivedToDistributor: data.isArrivedToDistributor || false,
        arrivedToDistributorAt: data.arrivedToDistributorAt ? data.arrivedToDistributorAt.toString() : "0",
        productName: data.productName || "Unknown",
        productQuantity: data.productQuantity ? data.productQuantity.toString() : "0",
        productHash: data.productHash ? data.productHash.toString() : "0",
        orderStatus: data.orderStatus || "Unknown",
        createdAt: data.createdAt ? data.createdAt.toString() : "0",
      };

      setOrder(formattedOrder);
    } catch (err) {
      if (err.message.includes("Invalid Order ID") || err.reason === "Invalid Order ID") {
        setError("Invalid Order ID");
      } else {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOrder(null);
    setError(null);
    setLoading(false);
  };

  return { order, loading, error, fetchOrder, reset };
}