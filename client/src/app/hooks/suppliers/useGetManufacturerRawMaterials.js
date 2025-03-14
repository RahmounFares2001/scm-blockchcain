"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetManufacturerRawMaterials() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawMaterials, setRawMaterials] = useState([]);

  const getAllManufacturerRawMaterials = async (manufacturerAddress) => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask!");

      setLoading(true);
      setError(null);
      setRawMaterials([]);

      const contract = await createEthereumContract("SupplierManagement2");
      if (!contract) {
        throw new Error("Error connecting to the contract");
      }

      const materials = await contract.getAllManufacturerRawMaterials(manufacturerAddress);
      setRawMaterials(materials);

      console.log("Manufacturer Raw Materials:", materials);
    } catch (err) {
      console.error("Error fetching manufacturer raw materials:", err);
      setError("Failed to fetch raw materials.");
    } finally {
      setLoading(false);
    }
  };

  return { getAllManufacturerRawMaterials, rawMaterials, loading, error };
}
