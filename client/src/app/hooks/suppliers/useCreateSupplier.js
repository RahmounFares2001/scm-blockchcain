"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useCreateSupplier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createSupplier = async (_supplierAddress, _name, _place, _emailAddress) => {
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

      const tx = await contract.createSupplier(_supplierAddress, _name, _place, _emailAddress);
      await tx.wait();

      setSuccess(true);
      alert("Supplier created successfully!");
    } catch (err) {
      console.error("Error creating supplier:", err);
      setError("Failed to create supplier.");
      alert("Error: Failed to create supplier");
    } finally {
      setLoading(false);
    }
  };

  return { createSupplier, loading, error, success };
}
