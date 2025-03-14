"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetMaterialById(materialId) {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!materialId) return;
      
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

        const fetchedMaterial = await contract.getMaterialById(materialId);
        setMaterial(fetchedMaterial);
      } catch (err) {
        console.error("Error fetching material:", err);
        setError("Failed to fetch material.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  return { material, loading, error };
}
