"use client";

import { createClientEthereumContract } from "@/app/utils/constants";
import { useState } from "react";

export default function useClientConfirmDelivery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const clientConfirmDelivery = async (clientOrderId) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log(clientOrderId);
      const contract = await createClientEthereumContract("OrderManagement2");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.clientConfirmDelivery(clientOrderId);
      await tx.wait();

      setSuccess(true);
      alert("Client order delivery confirmed successfully.");
    } catch (err) {
      console.error("Error confirming client order delivery:", err);
      setError("Failed to confirm client order delivery.");
    } finally {
      setLoading(false);
    }
  };

  return { clientConfirmDelivery, loading, error, success };
}
