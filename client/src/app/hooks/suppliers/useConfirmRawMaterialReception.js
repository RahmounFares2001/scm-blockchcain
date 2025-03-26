"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useConfirmRawMaterialReception() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const confirmRawMaterialReception = async (orderId) => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask!");

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("OrderManagement");
      if (!contract) {
        throw new Error("Error connecting to the contract");
      }

      const tx = await contract.confirmRawMaterialReception(orderId);
      await tx.wait(); // Wait for transaction confirmation

      setSuccess(true);
      alert("Order marked as delivered.")
    } catch (err) {
      console.error("Error confirming raw material reception:", err);
      setError("Failed to confirm raw material reception.");
    } finally {
      setLoading(false);
    }
  };

  return { confirmRawMaterialReception, loading, error, success };
}
