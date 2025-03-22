"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateMaterialPrice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

const updateMaterialPrice = async (params) => {
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
      const tx = await contract.updateMaterial(
        params.id,
        params.name,
        params.price,
        params.updatePriceRaison
      );
      
      console.log("Transaction submitted:", tx);
      await tx.wait();
      console.log("Transaction completed");
      
      setSuccess(true);
      alert("Material updated successfully!");
      return true;
    } catch (txError) {
      console.error("Transaction error:", txError);
      setError("Transaction failed: " + (txError.message || "Unknown error"));
      return false;
    }
  } catch (err) {
    console.error("Error updating material:", err);
    setError("Failed to update material: " + (err.message || "Unknown error"));
    alert("Error: " + (err.message || "Failed to update material."));
    return false;
  } finally {
    setLoading(false);
  }
};

  return { updateMaterialPrice, loading, error, success };
}