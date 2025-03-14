"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useDeleteSupplier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteSupplier = async (supplierAddress) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("UserManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.deleteSupplier(supplierAddress);
      await tx.wait();

      setSuccess(true);
      alert("Supplier deleted successfully!");
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setError("Failed to delete supplier.");
      alert("Error: Failed to delete supplier.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteSupplier, loading, error, success };
}
