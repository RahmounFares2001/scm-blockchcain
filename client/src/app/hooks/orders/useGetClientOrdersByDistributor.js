"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetClientOrdersByDistributor(distributorAddress) {
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

      const contract = await createEthereumContract();
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.getClientOrderByDistributorAddress(distributorAddress);

      const formattedClientOrders = data.map((order) => ({
        clientOrder: {
          id: order.clientOrder.id.toString(),
          orderId: order.clientOrder.orderId.toString(),
          clientName: order.clientOrder.clientName,
          clientAddress: order.clientOrder.clientAddress,
          clientProductQuantity: order.clientOrder.clientProductQuantity.toString(),
          shouldArriveToClientAt: order.clientOrder.shouldArriveToClientAt.toString(),
          isShippedToClient: order.clientOrder.isShippedToClient,
          shippedToClientAt: order.clientOrder.shippedToClientAt.toString(),
          isArrivedToClient: order.clientOrder.isArrivedToClient,
          deliveredToClientAt: order.clientOrder.deliveredToClientAt.toString(),
        },
        order: {
          id: order.order.id.toString(),
          manufacturerAddress: order.order.manufacturerAddress,
          manufacturerName: order.order.manufacturerName,
          isProduced: order.order.isProduced,
          producedAt: order.order.producedAt.toString(),
          isShippedToDistributor: order.order.isShippedToDistributor,
          shippedToDistributorAt: order.order.shippedToDistributorAt.toString(),
          distributorAddress: order.order.distributorAddress,
          distributorName: order.order.distributorName,
          isArrivedToDistributor: order.order.isArrivedToDistributor,
          arrivedToDistributorAt: order.order.arrivedToDistributorAt.toString(),
          productName: order.order.productName,
          productQuantity: order.order.productQuantity.toString(),
          orderStatus: order.order.orderStatus,
          createdAt: order.order.createdAt.toString(),
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
    if (distributorAddress) {
      fetchClientOrders();
    }
  }, [distributorAddress]);

  return { clientOrders, loading, error, refreshClientOrders: fetchClientOrders };
}
