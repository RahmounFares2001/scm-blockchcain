"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetSupplierMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSupplierMaterials = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract("SupplierManagement2");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.getSupplierMaterials();

      const formattedMaterials = data.map((material) => ({
        id: material.id.toString(),
        supplierAddress: material.supplierAddress,
        name: material.name,
        description: material.description,
        price: material.price.toString(),
        quantityAvailable: material.quantityAvailable.toString(),
        reviewPriceUpdate: material.reviewPriceUpdate.toString(),
        isAvailable: material.isAvailable,
        timestamp: material.timestamp.toString(),
        updatePriceRaison: material.updatePriceRaison,
        priceUpdateTimestamps: material.priceUpdateTimestamps.map((timestamp) =>
          timestamp.toString()
        ),
        reviewReason: material.reviewReason,
        isDeleted: material.isDeleted,
      }));

      setMaterials(formattedMaterials);
    } catch (err) {
      console.error("Error fetching supplier materials:", err);
      setError("Failed to fetch supplier materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierMaterials();
  }, []);

  return { materials, loading, error, fetchSupplierMaterials };
}