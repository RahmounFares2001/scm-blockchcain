"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetOrderById(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract("OrderManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.getOrderByOrderId(orderId);

      const formattedOrder = {
        id: data.id.toString(),
        manufacturerAddress: data.manufacturerAddress,
        manufacturerName: data.manufacturerName,
        isProduced: data.isProduced,
        producedAt: data.producedAt.toString(),
        isShippedToDistributor: data.isShippedToDistributor,
        shippedToDistributorAt: data.shippedToDistributorAt.toString(),
        distributorAddress: data.distributorAddress,
        distributorName: data.distributorName,
        isArrivedToDistributor: data.isArrivedToDistributor,
        arrivedToDistributorAt: data.arrivedToDistributorAt.toString(),
        productName: data.productName,
        productQuantity: data.productQuantity.toString(),
        orderStatus: data.orderStatus,
        createdAt: data.createdAt.toString(),
      };

      setOrder(formattedOrder);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  return { order, loading, error, refreshOrder: fetchOrder };
}
