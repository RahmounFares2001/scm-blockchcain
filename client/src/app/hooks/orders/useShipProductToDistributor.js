"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useShipProductToDistributor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const shipProductToDistributor = async (orderId) => {
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

      const tx = await contract.shipProductToDistributor(orderId);
      await tx.wait();

      setSuccess(true);
      alert("Product successfully shipped to the distributor.");
    } catch (err) {
      console.error("Error shipping product:", err);
      setError("Failed to ship product to distributor.");
    } finally {
      setLoading(false);
    }
  };

  return { shipProductToDistributor, loading, error, success };
}
