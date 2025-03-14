"use client";
import { useState, useEffect } from "react";

import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = async () => {
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

      const data = await contract.getAllSuppliers();

      const formattedSuppliers = data[0].map((address, index) => ({
        address,
        name: data[1][index],
        reliabilityRating: data[2][index].toString(),
        fraudStatus: data[3][index],
        place: data[4][index],
        email: data[5][index],
        violations: data[6][index],
      }));

      setSuppliers(formattedSuppliers);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to fetch suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, fetchSuppliers };
}
