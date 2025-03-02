"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useCreateDistributor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createDistributor = async (_distributorAddress, _name, _emailAddress, _place) => {
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

      const tx = await contract.createDistributor(_distributorAddress, _name, _emailAddress, _place);
      await tx.wait();

      setSuccess(true);
      alert("Distributor created successfully!"); 
    } catch (err) {
      console.error("Error creating distributor:", err);
      setError("Failed to create distributor.");
      alert("Error: Failed to create distributor");
    } finally {
      setLoading(false);
    }
  };

  return { createDistributor, loading, error, success };
}
