"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllManufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchManufacturers = async () => {
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

      const [addresses, names, emails, places] = await contract.getAllManufacturers();
      const manufacturerList = addresses.map((address, index) => ({
        address,
        name: names[index],
        email: emails[index],
        place: places[index],
      }));

      setManufacturers(manufacturerList);
    } catch (err) {
      console.error("Error fetching manufacturers:", err);
      setError("Failed to fetch manufacturers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  return { manufacturers, loading, error, refetch: fetchManufacturers };
}
