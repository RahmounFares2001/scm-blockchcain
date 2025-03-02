"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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

        const fetchedMaterials = await contract.getAllMaterials();
        setMaterials(fetchedMaterials);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setError("Failed to fetch materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return { materials, loading, error };
}
