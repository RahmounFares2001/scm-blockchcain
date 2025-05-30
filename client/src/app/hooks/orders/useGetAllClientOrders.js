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
      console.log("data", data);

      const formattedClientOrders = data.map(([clientOrder, order]) => ({
        clientOrder: {
          id: clientOrder[0].toString(), 
          orderId: clientOrder[1].toString(),
          clientName: clientOrder[2], 
          clientAddress: clientOrder[3], 
          clientProductQuantity: clientOrder[4].toString(), 
          shouldArriveToClientAt: clientOrder[5].toString(),
          isShippedToClient: clientOrder[6], 
          shippedToClientAt: clientOrder[7].toString(), 
          isArrivedToClient: clientOrder[8], 
          deliveredToClientAt: clientOrder[9].toString(),
        },
        order: {
          id: order[0].toString(), 
          manufacturerAddress: order[1],
          isProduced: order[2], 
          producedAt: order[3].toString(), 
          isShippedToDistributor: order[4], 
          shippedToDistributorAt: order[5].toString(), 
          distributorAddress: order[6], 
          isArrivedToDistributor: order[7], 
          arrivedToDistributorAt: order[8].toString(),
          productName: order[9], 
          productQuantity: order[10].toString(), 
          orderStatus: order[12],
          createdAt: order[11].toString(), 
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