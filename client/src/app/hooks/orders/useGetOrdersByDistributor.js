"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetOrdersByDistributor(distributorAddress) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract("OrderManagement2");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.getOrdersByDistributorAddress(distributorAddress);

      const formattedOrders = data.map((order) => ({
        id: order.id.toString(),
        manufacturerAddress: order.manufacturerAddress,
        manufacturerName: order.manufacturerName,
        isProduced: order.isProduced,
        producedAt: order.producedAt.toString(),
        isShippedToDistributor: order.isShippedToDistributor,
        shippedToDistributorAt: order.shippedToDistributorAt.toString(),
        distributorAddress: order.distributorAddress,
        distributorName: order.distributorName,
        isArrivedToDistributor: order.isArrivedToDistributor,
        arrivedToDistributorAt: order.arrivedToDistributorAt.toString(),
        productName: order.productName,
        productQuantity: order.productQuantity.toString(),
        orderStatus: order.orderStatus,
        createdAt: order.createdAt.toString(),
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distributorAddress) fetchOrders();
  }, [distributorAddress]);

  return { orders, loading, error, refreshOrders: fetchOrders };
}
