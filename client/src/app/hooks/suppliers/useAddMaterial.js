"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useAddMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addMaterial = async (_name, _description, _price, _quantityAvailable) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("SupplierManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const tx = await contract.addMaterial(_name, _description, _price, _quantityAvailable);
      await tx.wait();

      setSuccess(true);
      alert("Material added successfully!");
    } catch (err) {
      console.error("Error adding material:", err);
      setError("Failed to add material.");
      alert("Error: Failed to add material.");
    } finally {
      setLoading(false);
    }
  };

  return { addMaterial, loading, error, success };
}
