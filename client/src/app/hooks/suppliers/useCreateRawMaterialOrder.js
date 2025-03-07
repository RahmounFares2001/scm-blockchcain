"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useCreateRawMaterialOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createOrderRawMaterial = async (
    supplierAddress,
    manufacturerAddress,
    materialName,
    materialId,
    quantityOrdered,
    price,
    shouldArriveAt
  ) => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask!");

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract();
      if (!contract) {
        throw new Error("Error connecting to the contract");
      }

      const tx = await contract.createOrderRawMaterial(
        supplierAddress,
        manufacturerAddress,
        materialName,
        materialId,
        quantityOrdered,
        price,
        shouldArriveAt
      );

      await tx.wait(); 

      setSuccess(true);
      alert("Order for material created successfully")
    } catch (err) {
      console.error("Error creating raw material order:", err);
      setError("Failed to create raw material order.");
    } finally {
      setLoading(false);
    }
  };

  return { createOrderRawMaterial, loading, error, success };
}
