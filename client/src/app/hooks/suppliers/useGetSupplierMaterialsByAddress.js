"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetSupplierMaterialsByAddress(supplierAddress) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterials = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      // Connect to the contract
      const contract = await createEthereumContract("SupplierManagement2");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      // Fetch materials for the supplier
      const data = await contract.getSupplierMaterialsByAddress(supplierAddress);
      console.log("Raw data from contract:", data);

      // Format the materials
      const formattedMaterials = data.map((material) => ({
        id: Number(material[0]), 
        supplierAddress: material[1],
        name: material[2],
        description: material[3], 
        price: Number(material[4]),
        quantityAvailable: Number(material[5]), 
        reviewPriceUpdate: Number(material[6]), 
        isAvailable: material[7],
        timestamp: new Date(Number(material[8]) * 1000).toLocaleString(), 
        updatePriceRaison: material[9], 
        priceUpdateTimestamps: material[10].map((timestamp) => Number(timestamp)), 
        reviewReason: material[11], 
        isDeleted: material[12],
      }));

      setMaterials(formattedMaterials);
    } catch (err) {
      console.error("Error fetching materials:", err);
      setError("Failed to fetch materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierAddress) {
      fetchMaterials();
    }
  }, [supplierAddress]);

  return { materials, loading, error, fetchMaterials };
}