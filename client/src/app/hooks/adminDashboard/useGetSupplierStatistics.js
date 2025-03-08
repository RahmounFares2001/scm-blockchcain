"use client";
import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

const useGetSupplierStatistics = () => {
  const [fraudCount, setFraudCount] = useState(0);
  const [reliableCount, setReliableCount] = useState(0);
  const [underReviewCount, setUnderReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSupplierStatistics = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract();
      const [fraud, reliable, underReview] = await contract.getSupplierStatistics();

      setFraudCount(fraud.toNumber());
      setReliableCount(reliable.toNumber());
      setUnderReviewCount(underReview.toNumber());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierStatistics();
  }, []);

  return {
    fraudCount,
    reliableCount,
    underReviewCount,
    loading,
    error,
    fetchSupplierStatistics,
  };
};

export default useGetSupplierStatistics;