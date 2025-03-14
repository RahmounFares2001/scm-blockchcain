"use client";

import { useState } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetManufacturerByAddress() {
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchManufacturer = async (manufacturerAddress) => {
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

      const manufacturerDetails = await contract.getManufacturerByAddress(manufacturerAddress);
      setManufacturer(manufacturerDetails);
    } catch (err) {
      console.error("Error fetching manufacturer:", err);
      setError("Failed to fetch manufacturer.");
    } finally {
      setLoading(false);
    }
  };

  return { manufacturer, loading, error, fetchManufacturer };
}
