"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetDistributorClientOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract("OrderManagement2");
      if (!contract) {
        throw new Error("Error connecting to the contract");
      }

      const clientOrders = await contract.getDistributorClientOrders();

      // Format the returned data
      const formattedOrders = clientOrders.map((item) => ({
        clientOrder: {
          id: item.clientOrder.id.toString(),
          orderId: item.clientOrder.orderId.toString(),
          clientName: item.clientOrder.clientName,
          clientAddress: item.clientOrder.clientAddress,
          clientProductQuantity: item.clientOrder.clientProductQuantity.toString(),
          shouldArriveToClientAt: item.clientOrder.shouldArriveToClientAt.toString(),
          isShippedToClient: item.clientOrder.isShippedToClient,
          shippedToClientAt: item.clientOrder.shippedToClientAt.toString(),
          isArrivedToClient: item.clientOrder.isArrivedToClient,
          deliveredToClientAt: item.clientOrder.deliveredToClientAt.toString(),
        },
        order: {
          id: item.order.id.toString(),
          manufacturerAddress: item.order.manufacturerAddress,
          isProduced: item.order.isProduced,
          producedAt: item.order.producedAt.toString(),
          isShippedToDistributor: item.order.isShippedToDistributor,
          shippedToDistributorAt: item.order.shippedToDistributorAt.toString(),
          distributorAddress: item.order.distributorAddress,
          isArrivedToDistributor: item.order.isArrivedToDistributor,
          arrivedToDistributorAt: item.order.arrivedToDistributorAt.toString(),
          productName: item.order.productName,
          productQuantity: item.order.productQuantity.toString(),
          productHash: item.order.productHash.toString(),
          orderStatus: item.order.orderStatus,
        },
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching distributor client orders:", err);
      setError(err.message || "Failed to load distributor client orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, fetchOrders };
}