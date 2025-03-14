"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useDeleteDistributor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteDistributor = async (distributorAddress) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("UserManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.deleteDistributor(distributorAddress);
      await tx.wait();

      setSuccess(true);
      alert("Distributor deleted successfully!");
    } catch (err) {
      console.error("Error deleting distributor:", err);
      setError("Failed to delete distributor.");
      alert("Error: Failed to delete distributor");
    } finally {
      setLoading(false);
    }
  };

  return { deleteDistributor, loading, error, success };
}
