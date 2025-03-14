"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateSupplierReliabilityOnQuantity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSupplierReliabilityOnQuantity = async (supplierAddress, orderId, quantityReceived) => {
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

      const tx = await contract.updateSupplierReliabilityOnQuantity(supplierAddress, orderId, quantityReceived);
      await tx.wait();

      setSuccess(true);
      alert("Supplier reliability updated based on quantity received!");
    } catch (err) {
      console.error("Error updating supplier reliability on quantity:", err);
      setError("Failed to update supplier reliability on quantity.");
      alert("Error: Failed to update supplier reliability.");
    } finally {
      setLoading(false);
    }
  };

  return { updateSupplierReliabilityOnQuantity, loading, error, success };
}
