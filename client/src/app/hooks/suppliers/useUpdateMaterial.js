"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateMaterial = async (_id, _name, _description, _price, _quantityAvailable, updatePriceRaison) => {
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

      const tx = await contract.updateMaterial(_id, _name, _description, _price, _quantityAvailable, updatePriceRaison);
      await tx.wait();

      setSuccess(true);
      alert("Material updated successfully!");
    } catch (err) {
      console.error("Error updating material:", err);
      setError("Failed to update material.");
      alert("Error: Failed to update material.");
    } finally {
      setLoading(false);
    }
  };

  return { updateMaterial, loading, error, success };
}
