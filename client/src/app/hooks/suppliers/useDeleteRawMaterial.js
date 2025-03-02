"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useDeleteRawMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteRawMaterial = async (rawMaterialAddress, materialId) => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask!");

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract();
      if (!contract) {
        throw new Error("Error connecting to the contract");
      }

      const tx = await contract.deleteRawMaterial(rawMaterialAddress, materialId);
      await tx.wait(); // Wait for transaction confirmation

      setSuccess(true);
      console.log(`Raw material ${materialId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting raw material:", err);
      setError("Failed to delete raw material.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteRawMaterial, loading, error, success };
}
