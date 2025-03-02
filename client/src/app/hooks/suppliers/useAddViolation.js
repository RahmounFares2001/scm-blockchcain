"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useAddViolation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addViolation = async (supplierAddress, violation) => {
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

      const tx = await contract.addViolation(supplierAddress, violation);
      await tx.wait();

      setSuccess(true);
      alert("Violation added successfully!");
    } catch (err) {
      console.error("Error adding violation:", err);
      setError("Failed to add violation.");
      alert("Error: Failed to add violation.");
    } finally {
      setLoading(false);
    }
  };

  return { addViolation, loading, error, success };
}
