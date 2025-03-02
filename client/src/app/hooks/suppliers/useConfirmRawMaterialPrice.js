"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useConfirmRawMaterialPrice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const confirmRawMaterialPrice = async (_id, _approve) => {
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

      const tx = await contract.confirmNewRawMaterialPrice(_id, _approve);
      await tx.wait();

      setSuccess(true);
      alert("Raw material price update confirmed successfully!");
    } catch (err) {
      console.error("Error confirming raw material price:", err);
      setError("Failed to confirm raw material price.");
      alert("Error: Failed to confirm raw material price.");
    } finally {
      setLoading(false);
    }
  };

  return { confirmRawMaterialPrice, loading, error, success };
}
