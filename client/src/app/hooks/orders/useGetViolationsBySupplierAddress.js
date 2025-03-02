"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetViolationsBySupplierAddress(supplierAddress) {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchViolations = async () => {
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

      const data = await contract.getViolationsBySupplierAddress(supplierAddress);

      setViolations(data);
    } catch (err) {
      console.error("Error fetching violations:", err);
      setError("Failed to load violations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierAddress) {
      fetchViolations();
    }
  }, [supplierAddress]);

  return { violations, loading, error, refreshViolations: fetchViolations };
}
