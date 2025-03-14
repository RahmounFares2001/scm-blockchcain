"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useReviewRawMaterialPrice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reviewPrice = async (materialId, approve) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract("SupplierManagement2"); 
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const transaction = await contract.useReviewRawMaterialPrice(materialId, approve);

      await transaction.wait();

      alert("Price review completed successfully!");
    } catch (err) {
      console.error("Error reviewing price:", err);
      setError("Failed to review price.");
    } finally {
      setLoading(false);
    }
  };

  return { reviewPrice, loading, error };
}