"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

const useGetMaterialOrderStatistics = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [shippedCount, setShippedCount] = useState(0); 
  const [deliveredCount, setDeliveredCount] = useState(0); 
  const [canceledCount, setCanceledCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterialOrderStatistics = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract("Dashboard");
      if (!contract) {
        throw new Error("Failed to connect to the Dashboard contract");
      }

      // Fetch material order statistics
      const [pending, shipped, delivered, canceled] = await contract.getMaterialOrderStatistics();

      // Log for debugging (optional, can remove in production)
      console.log("Material Order Statistics:", { pending, shipped, delivered, canceled });

      setPendingCount(Number(pending));
      setShippedCount(Number(shipped)); 
      setDeliveredCount(Number(delivered)); 
      setCanceledCount(Number(canceled));
    } catch (err) {
      console.error("Error fetching material order statistics:", err);
      setError(err.message || "Failed to fetch material order statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialOrderStatistics();
  }, []);

  return {
    pendingCount,
    shippedCount,
    deliveredCount,
    canceledCount,
    loading,
    error,
    fetchMaterialOrderStatistics,
  };
};

export default useGetMaterialOrderStatistics;