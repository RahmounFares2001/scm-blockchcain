"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useFetchDistributors() {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDistributors = async () => {
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

      const [addresses, names, emails, places] = await contract.getAllDistributors();

      const formattedDistributors = addresses.map((address, index) => ({
        address,
        name: names[index],
        email: emails[index],
        place: places[index],
      }));

      setDistributors(formattedDistributors);
    } catch (err) {
      console.error("Error fetching distributors:", err);
      setError("Failed to fetch distributors.");
      alert("Error: Failed to fetch distributors");
    } finally {
      setLoading(false);
    }
  };

  return { fetchDistributors, distributors, loading, error };
}
