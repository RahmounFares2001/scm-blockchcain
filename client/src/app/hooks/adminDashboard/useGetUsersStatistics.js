"use client"
import { createEthereumContract } from "@/app/utils/constants";
import { useEffect, useState } from "react";

// useGetUsersStatistics.js
const useGetUsersStatistics = () => {
  const [supplierCount, setSupplierCount] = useState(0);
  const [manufacturerCount, setManufacturerCount] = useState(0);
  const [distributorCount, setDistributorCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsersStatistics = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);


      const contract = await createEthereumContract("Dashboard");

      const [suppliers, manufacturers, distributors] = await contract.getUsersStatistics();

      setSupplierCount(Number(suppliers));
      setManufacturerCount(Number(manufacturers));
      setDistributorCount(Number(distributors));
    } catch (err) {
      console.error("Error fetching users statistics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersStatistics();
  }, []);

  return {
    supplierCount,
    manufacturerCount,
    distributorCount,
    loading,
    error,
    fetchUsersStatistics,
  };
};

export default useGetUsersStatistics; 