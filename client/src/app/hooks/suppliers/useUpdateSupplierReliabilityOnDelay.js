"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateSupplierReliabilityOnDelay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSupplierReliability = async (supplierAddress, orderId, confirmDelivery) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("SupplierManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.updateSupplierReliabilityOnDelay(supplierAddress, orderId, confirmDelivery);
      await tx.wait();

      setSuccess(true);
    } catch (err) {
      console.error("Error updating supplier reliability:", err);
      setError("Failed to update supplier reliability.");
      alert("Error: Failed to update supplier reliability.");
    } finally {
      setLoading(false);
    }
  };

  return { updateSupplierReliability, loading, error, success };
}
