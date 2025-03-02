"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useCreateManufacturer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createManufacturer = async (_manufacturerAddress, _name, _email, _place) => {
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

      const tx = await contract.createManufacturer(_manufacturerAddress, _name, _email, _place);
      await tx.wait();

      setSuccess(true);
      alert("Manufacturer created successfully!");
    } catch (err) {
      console.error("Error creating manufacturer:", err);
      setError("Failed to create manufacturer.");
      alert("Error: Failed to create manufacturer");
    } finally {
      setLoading(false);
    }
  };

  return { createManufacturer, loading, error, success };
}
