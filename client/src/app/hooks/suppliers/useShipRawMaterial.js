"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useShipRawMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const shipRawMaterial = async (orderId) => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask!");

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract();
      if (!contract) {
        throw new Error("Error connecting to the contract");
      }

      const tx = await contract.shipRawMaterial(orderId);
      await tx.wait(); 

      setSuccess(true);
      alert("Order marked as shipped")
    } catch (err) {
      console.error("Error shipping raw material:", err);
      setError("Failed to ship raw material order.");
    } finally {
      setLoading(false);
    }
  };

  return { shipRawMaterial, loading, error, success };
}
