"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useDeleteManufacturer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteManufacturer = async (manufacturerAddress) => {
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

      const tx = await contract.deleteManufacturer(manufacturerAddress);
      await tx.wait();

      setSuccess(true);
      alert("Manufacturer deleted successfully!");
    } catch (err) {
      console.error("Error deleting manufacturer:", err);
      setError("Failed to delete manufacturer.");
      alert("Error: Failed to delete manufacturer");
    } finally {
      setLoading(false);
    }
  };

  return { deleteManufacturer, loading, error, success };
}
