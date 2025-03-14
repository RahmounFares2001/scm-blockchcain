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

      const contract = await createEthereumContract("SupplierManagement2");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.methods.getAllMaterials().call();

      const formattedMaterials = data.map((item) => ({
        material: {
          id: item.material.id.toNumber(),
          supplierAddress: item.material.supplierAddress,
          name: item.material.name,
          description: item.material.description,
          price: item.material.price.toNumber(),
          quantityAvailable: item.material.quantityAvailable.toNumber(),
          reviewPriceUpdate: item.material.reviewPriceUpdate.toNumber(),
          isAvailable: item.material.isAvailable,
          timestamp: item.material.timestamp.toNumber(),
          updatePriceRaison: item.material.updatePriceRaison,
          priceUpdateTimestamps: item.material.priceUpdateTimestamps.map((timestamp) => timestamp.toNumber()),
          reviewReason: item.material.reviewReason,
          isDeleted: item.material.isDeleted,
        },
        supplier: {
          name: item.supplier.name,
          reliabilityRating: item.supplier.reliabilityRating.toNumber(),
          isFraud: item.supplier.isFraud,
          place: item.supplier.place,
          emailAddress: item.supplier.emailAddress,
          violations: item.supplier.violations,
          isDeleted: item.supplier.isDeleted,
        },
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