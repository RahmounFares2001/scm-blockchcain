"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useFetchDistributorByAddress() {
  const [distributor, setDistributor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDistributorByAddress = async (distributorAddress) => {
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

      const distributorData = await contract.getDistributorByAddress(distributorAddress);

      setDistributor({
        name: distributorData.name,
        email: distributorData.emailAddress,
        place: distributorData.place,
        isDeleted: distributorData.isDeleted,
      });
    } catch (err) {
      console.error("Error fetching distributor:", err);
      setError("Failed to fetch distributor.");
      alert("Error: Failed to fetch distributor");
    } finally {
      setLoading(false);
    }
  };

  return { fetchDistributorByAddress, distributor, loading, error };
}
