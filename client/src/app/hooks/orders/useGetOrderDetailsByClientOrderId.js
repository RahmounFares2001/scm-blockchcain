"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetOrderDetailsByClientOrderId(clientOrderId) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async (orderId) => {
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
      
      const data = await contract.getOrderDetailsByClientOrderId(orderId);
      
      const formattedDetails = {
        order: {
          id: data[0][0].toString(),
          manufacturerAddress: data[0][1],
          isProduced: data[0][2],
          producedAt: data[0][3].toString(),
          isShippedToDistributor: data[0][4],
          shippedToDistributorAt: data[0][5].toString(),
          distributorAddress: data[0][6],
          isArrivedToDistributor: data[0][7],
          arrivedToDistributorAt: data[0][8].toString(),
          productName: data[0][9],
          productQuantity: data[0][10].toString(),
          productHash: data[0][11].toString(),
          createdAt: data[0][12],
        },
        clientOrder: {
          id: data[1][0].toString(),
          orderId: data[1][1].toString(),
          clientName: data[1][2],
          clientAddress: data[1][3],
          clientProductQuantity: data[1][4].toString(),
          shouldArriveToClientAt: data[1][5].toString(),
          isShippedToClient: data[1][6],
          shippedToClientAt: data[1][7].toString(),
          isArrivedToClient: data[1][8],
          deliveredToClientAt: data[1][9].toString(),
        },
      };
      console.log(formattedDetails)
      
      setOrderDetails(formattedDetails);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOrderDetails(null);
    setError(null);
    setLoading(false);
  };
  // useEffect(() => {
  //   if (clientOrderId) {
  //     fetchOrder();
  //   }
  // }, [clientOrderId]);

  return { orderDetails, loading, error, fetchOrder, reset };
}
