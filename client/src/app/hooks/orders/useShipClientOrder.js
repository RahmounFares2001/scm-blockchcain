"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useShipClientOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const shipClientOrder = async (clientOrderId) => {
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
      
      const tx = await contract.shipClientOrder(clientOrderId);
      await tx.wait();

      setSuccess(true);
      alert("Client order shipped successfully.");
    } catch (err) {
      console.error("Error shipping client order:", err);
      setError("Failed to ship client order.");
    } finally {
      setLoading(false);
    }
  };

  return { shipClientOrder, loading, error, success };
}
