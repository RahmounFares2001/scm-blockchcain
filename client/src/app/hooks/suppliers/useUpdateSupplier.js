"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateSupplier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSupplier = async (
    supplierAddress,
    name,
    reliabilityRating,
    isFraud,
    place,
    emailAddress
  ) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return false;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("SupplierManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return false; 
      }

      const tx = await contract.updateSupplier(
        supplierAddress,
        name,
        reliabilityRating,
        isFraud,
        place,
        emailAddress
      );

      await tx.wait();

      setSuccess(true);
      alert("Supplier updated successfully!");
      return true; 
    } catch (err) {
      console.error("Error updating supplier:", err);
      setError("Failed to update supplier.");
      alert("Error: Failed to update supplier.");
      return false; 
    } finally {
      setLoading(false);
    }
  };

  return { updateSupplier, loading, error, success };
}