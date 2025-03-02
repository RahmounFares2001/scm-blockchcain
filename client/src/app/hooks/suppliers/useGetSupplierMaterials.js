"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetSupplierMaterials() {
  const [supplierMaterials, setSupplierMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);

  // Fetch the user's account
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (!window.ethereum) throw new Error("Please install MetaMask!");

        // Check if the user is already connected
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          // If not connected, request access
          const requestedAccounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(requestedAccounts[0]);
        }
      } catch (err) {
        console.error("Error fetching account:", err);
        setError("Failed to get wallet account.");
      }
    };

    fetchAccount();
  }, []);

  // Fetch supplier materials when the account changes
  useEffect(() => {
    const fetchSupplierMaterials = async () => {
      if (!account) return; // Exit if no account is connected

      try {
        setLoading(true);
        setError(null);

        // Initialize the contract
        const contract = await createEthereumContract();
        if (!contract) {
          setError("Error connecting to the contract");
          return;
        }

        // Fetch materials from the contract
        const fetchedMaterials = await contract.getSupplierMaterials();
        setSupplierMaterials(fetchedMaterials);
      } catch (err) {
        console.error("Error fetching supplier materials:", err);
        setError("Failed to fetch supplier materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierMaterials();
  }, [account]);

  // Handle account changes (e.g., when the user switches accounts in MetaMask)
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]); // Update the account state
      } else {
        setAccount(null); // No accounts connected
      }
    };

    // Listen for account changes
    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    // Cleanup listener
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return { supplierMaterials, loading, error };
}