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

      // Format the materials
      const formattedMaterials = data.map((material) => ({
        id: material.id.toString(),
        name: material.name,
        quantity: material.quantity.toString(),
        supplierAddress: material.supplierAddress,
        createdAt: new Date(material.createdAt * 1000).toLocaleString(),
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