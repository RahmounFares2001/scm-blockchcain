"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetSupplierByAddress(supplierAddress) {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSupplier = async (supplierAddress) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
  
      setLoading(true);
      setError(null);
  
      const contract = await createEthereumContract("UserManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }
  
      const data = await contract.getSupplierByAddress(supplierAddress);
  
      const ratingInTenths = Number(data.reliabilityRating);
      const formattedRating = (ratingInTenths / 10).toFixed(1);
  
      const formattedSupplier = {
        address: supplierAddress,
        name: data.name,
        reliabilityRating: formattedRating, 
        fraudStatus: data.isFraud,
        place: data.place,
        email: data.emailAddress,
        violations: data.violations, 
      };
  
      setSupplier(formattedSupplier);
    } catch (err) {
      console.error("Error fetching supplier:", err);
      setError("Failed to fetch supplier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierAddress) {
      fetchSupplier(supplierAddress);
    }
  }, [supplierAddress]);

  return { supplier, loading, error, refetch: fetchSupplier };
}