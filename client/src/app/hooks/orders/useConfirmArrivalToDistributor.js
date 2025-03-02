"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useConfirmArrivalToDistributor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const confirmArrivalToDistributor = async (orderId) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract();
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.confirmArrivalToDistributor(orderId);
      await tx.wait();

      setSuccess(true);
      alert("Arrival confirmed successfully.");
    } catch (err) {
      console.error("Error confirming arrival:", err);
      setError("Failed to confirm arrival.");
    } finally {
      setLoading(false);
    }
  };

  return { confirmArrivalToDistributor, loading, error, success };
}
