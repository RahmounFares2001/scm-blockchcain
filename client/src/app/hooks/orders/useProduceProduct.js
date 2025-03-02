"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useProduceProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const produceProduct = async (orderId) => {
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

      const tx = await contract.produceProduct(orderId);
      await tx.wait();

      setSuccess(true);
      alert("Product successfully marked as produced.");
    } catch (err) {
      console.error("Error producing product:", err);
      setError("Failed to mark product as produced.");
    } finally {
      setLoading(false);
    }
  };

  return { produceProduct, loading, error, success };
}
