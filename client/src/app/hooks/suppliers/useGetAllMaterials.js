"use client";

import { createEthereumContract } from "@/app/utils/constants";
import { useState, useEffect } from "react";

export default function useGetAllMaterials() {
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

      const contract = await createEthereumContract();
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.getAllMaterials();

      const formattedMaterials = data.map((material) => ({
        id: material.id.toNumber(),
        supplierAddress: material.supplierAddress,
        name: material.name,
        description: material.description,
        price: material.price.toNumber(),
        quantityAvailable: material.quantityAvailable.toNumber(),
        reviewPriceUpdate: material.reviewPriceUpdate.toNumber(),
        isAvailable: material.isAvailable,
        timestamp: material.timestamp.toNumber(),
        updatePriceRaison: material.updatePriceRaison,
        priceUpdateTimestamps: material.priceUpdateTimestamps.map((timestamp) => timestamp.toNumber()),
        reviewReason: material.reviewReason,
        isDeleted: material.isDeleted,
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
    fetchMaterials();
  }, []);

  return { materials, loading, error, fetchMaterials };
}