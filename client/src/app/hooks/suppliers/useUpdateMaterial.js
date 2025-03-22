"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useUpdateMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateMaterial = async ({ id, name, price, quantityAvailable, updatePriceRaison, shouldUpdate }) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return false;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const contract = await createEthereumContract("SupplierManagement2");

      if (!contract) {
        setError("Error connecting to the contract");
        return false;
      }

      let tx;

      console.log("id", id);
      console.log("name", name);
      console.log("updatePriceRaison", updatePriceRaison);
      console.log("price", price);
      console.log("quantityAvailable", quantityAvailable);
      console.log("shouldUpdate", shouldUpdate);


      if (shouldUpdate == "price") {
          tx = await contract.updateMaterialPrice(id, name, price, updatePriceRaison);
      } else if (shouldUpdate == "quantityAvailable") {
        tx = await contract.updateMaterialQuantity(id, quantityAvailable);  
      }

      // tx = await contract.updateMaterialQuantity(id, quantityAvailable);
      
      await tx.wait();

      setSuccess(true);
      alert("Material updated successfully!");
      return true;
    } catch (txError) {
      console.error("Transaction error:", txError);
      setError("Transaction failed: " + (txError.message || "Unknown error"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateMaterial, loading, error, success };
}
