"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useSetSupplierFraudStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const setSupplierFraudStatus = async (supplierAddress, isFraud, newReliabilityRating) => {
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

      const tx = await contract.setSupplierFraudStatus(supplierAddress, isFraud, newReliabilityRating);
      await tx.wait();

      setSuccess(true);
      alert("Supplier fraud status updated successfully!");
    } catch (err) {
      console.error("Error updating supplier fraud status:", err);
      setError("Failed to update supplier fraud status.");
      alert("Error: Failed to update supplier fraud status.");
    } finally {
      setLoading(false);
    }
  };

  return { setSupplierFraudStatus, loading, error, success };
}
