"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  const createOrder = async (
    manufacturerAddress,
    distributorAddress,
    productName,
    productQuantity
  ) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setTransactionHash(null);

      const contract = await createEthereumContract("OrderManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.createOrder(
        manufacturerAddress,
        distributorAddress,
        productName,
        productQuantity
      );

      await tx.wait();
      setTransactionHash(tx.hash);

      alert("Order created successfully!");
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create the order.");
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, transactionHash };
}
