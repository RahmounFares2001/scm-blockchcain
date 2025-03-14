"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useAddClientOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addClientOrder = async (orderId, clientName, clientAddress, clientProductQuantity, shouldArriveToClientAt) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("OrderManagement2");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.addClientOrder(
        orderId, 
        clientName, 
        clientAddress, 
        clientProductQuantity, 
        shouldArriveToClientAt
      );
      await tx.wait();

      setSuccess(true);
      alert("Client order added successfully.");
    } catch (err) {
      console.error("Error adding client order:", err);
      setError("Failed to add client order.");
    } finally {
      setLoading(false);
    }
  };

  return { addClientOrder, loading, error, success };
}
