"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllClientOrders() {
  const [clientOrders, setClientOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientOrders = async () => {
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

      const data = await contract.getAllClientOrders();

      const formattedClientOrders = data.map((item) => ({
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
          manufacturerName: item.order.manufacturerName,
          isProduced: item.order.isProduced,
          producedAt: item.order.producedAt.toString(),
          isShippedToDistributor: item.order.isShippedToDistributor,
          shippedToDistributorAt: item.order.shippedToDistributorAt.toString(),
          distributorAddress: item.order.distributorAddress,
          distributorName: item.order.distributorName,
          isArrivedToDistributor: item.order.isArrivedToDistributor,
          arrivedToDistributorAt: item.order.arrivedToDistributorAt.toString(),
          productName: item.order.productName,
          productQuantity: item.order.productQuantity.toString(),
          orderStatus: item.order.orderStatus,
          createdAt: item.order.createdAt.toString(),
        },
      }));

      setClientOrders(formattedClientOrders);
    } catch (err) {
      console.error("Error fetching client orders:", err);
      setError("Failed to load client orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientOrders();
  }, []);

  return { clientOrders, loading, error, refreshClientOrders: fetchClientOrders };
}
