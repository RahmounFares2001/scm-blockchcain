"use client";

import { useState, useEffect } from "react";
import { createClientEthereumContract } from "@/app/utils/constants";

export default function useGetManufacturerByAddress(manufacturerAddress) {
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchManufacturer = async (address) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createClientEthereumContract("UserManagement");
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.getManufacturerByAddress(address);
      // Convert BigInt values to numbers/strings
      const formattedManufacturer = {
        address: address,
        name: data.name,
        place: data.place,
        email: data.email,
      };

      setManufacturer(formattedManufacturer);
    } catch (err) {
      console.error("Error fetching manufacturer:", err);
      setError("Failed to fetch manufacturer.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when manufacturerAddress changes
  useEffect(() => {
    if (manufacturerAddress) {
      fetchManufacturer(manufacturerAddress);
    }
  }, [manufacturerAddress]);

  return { manufacturer, loading, error, fetchManufacturer };
}