"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateMaterialQuantity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateMaterialQuantity = async (id, newQuantity) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return false;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("SupplierManagement2");
      console.log("Contract object:", contract);

      if (!contract) {
        setError("Error connecting to the contract");
        return false;
      }

      try {
        const tx = await contract.updateMaterialQuantity(id, newQuantity);

        console.log("Transaction submitted:", tx);
        await tx.wait();
        console.log("Transaction completed");

        setSuccess(true);
        alert("Material quantity updated successfully!");
        return true;
      } catch (txError) {
        console.error("Transaction error:", txError);
        setError("Transaction failed: " + (txError.message || "Unknown error"));
        return false;
      }
    } catch (err) {
      console.error("Error updating material quantity:", err);
      setError(
        "Failed to update material quantity: " + (err.message || "Unknown error")
      );
      alert("Error: " + (err.message || "Failed to update material quantity."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateMaterialQuantity, loading, error, success };
}
