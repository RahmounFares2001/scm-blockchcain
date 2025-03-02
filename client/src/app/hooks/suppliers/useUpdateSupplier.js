"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateSupplier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSupplier = async (supplierAddress, name, reliabilityRating, isFraud, place, emailAddress) => {
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

      const tx = await contract.updateSupplier(supplierAddress, name, reliabilityRating, isFraud, place, emailAddress);
      await tx.wait();

      setSuccess(true);
      alert("Supplier updated successfully!");
    } catch (err) {
      console.error("Error updating supplier:", err);
      setError("Failed to update supplier.");
      alert("Error: Failed to update supplier.");
    } finally {
      setLoading(false);
    }
  };

  return { updateSupplier, loading, error, success };
}
