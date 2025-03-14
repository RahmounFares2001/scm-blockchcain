"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetSupplierByAddress() {
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

      const formattedSupplier = {
        address: supplierAddress,
        name: data.name,
        reliabilityRating: data.reliabilityRating.toString(),
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

  return { supplier, loading, error, fetchSupplier };
}
