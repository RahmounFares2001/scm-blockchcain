"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetOrderDetailsByClientOrderId(clientOrderId) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
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

      const data = await contract.getOrderDetailsByClientOrderId(clientOrderId);

      const formattedDetails = {
        order: {
          id: data[0].id.toString(),
          manufacturerAddress: data[0].manufacturerAddress,
          manufacturerName: data[0].manufacturerName,
          isProduced: data[0].isProduced,
          producedAt: data[0].producedAt.toString(),
          isShippedToDistributor: data[0].isShippedToDistributor,
          shippedToDistributorAt: data[0].shippedToDistributorAt.toString(),
          distributorAddress: data[0].distributorAddress,
          distributorName: data[0].distributorName,
          isArrivedToDistributor: data[0].isArrivedToDistributor,
          arrivedToDistributorAt: data[0].arrivedToDistributorAt.toString(),
          productName: data[0].productName,
          productQuantity: data[0].productQuantity.toString(),
          orderStatus: data[0].orderStatus,
          createdAt: data[0].createdAt.toString(),
        },
        clientOrder: {
          id: data[1].id.toString(),
          orderId: data[1].orderId.toString(),
          clientName: data[1].clientName,
          clientAddress: data[1].clientAddress,
          clientProductQuantity: data[1].clientProductQuantity.toString(),
          shouldArriveToClientAt: data[1].shouldArriveToClientAt.toString(),
          isShippedToClient: data[1].isShippedToClient,
          shippedToClientAt: data[1].shippedToClientAt.toString(),
          isArrivedToClient: data[1].isArrivedToClient,
          deliveredToClientAt: data[1].deliveredToClientAt.toString(),
        },
      };

      setOrderDetails(formattedDetails);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientOrderId) {
      fetchOrderDetails();
    }
  }, [clientOrderId]);

  return { orderDetails, loading, error, refreshOrderDetails: fetchOrderDetails };
}
