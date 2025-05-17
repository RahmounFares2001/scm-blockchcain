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

      const data = await contract.getAllMaterials();


      const formattedMaterials = data.map((item) => {
        const material = {
          id: Number(item.material[0]),
          supplierAddress: item.material[1],
          name: item.material[2],
          description: item.material[3],
          price: Number(item.material[4]),
          quantityAvailable: Number(item.material[5]),
          reviewPriceUpdate: Number(item.material[6]),
          isAvailable: item.material[7],
          timestamp: Number(item.material[8]),
          updatePriceRaison: item.material[9],
          priceUpdateTimestamps: item.material[10].map((timestamp) => Number(timestamp)),
          reviewReason: item.material[11],
          isDeleted: item.material[12],
        };

        const ratingInTenths = Number(item.supplier[1]);
        const formattedRating = (ratingInTenths / 10).toFixed(1);

        const supplier = {
          name: item.supplier[0],
          reliabilityRating: formattedRating,
          isFraud: item.supplier[2],
          place: item.supplier[3],
          emailAddress: item.supplier[4],
          violations: item.supplier[5],
          isDeleted: item.supplier[6],
        };

        return { material, supplier };
      });

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