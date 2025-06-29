"use client";

import { useState, useEffect } from "react";
import useGetSupplierByAddress from "@/app/hooks/suppliers/useGetSupplierByAddress";

export default function SupplierAccount() {
  const [supplierAddress, setSupplierAddress] = useState(null);
  const { supplier, loading, error } = useGetSupplierByAddress(supplierAddress);

  // Fetch supplier address from MetaMask
  useEffect(() => {
    const getAccount = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          if (accounts.length > 0) {
            setSupplierAddress(accounts[0]);
          } else {
            console.error("No accounts found in MetaMask");
          }
        } catch (err) {
          console.error("Error fetching MetaMask account:", err);
        }
      } else {
        console.error("MetaMask not detected");
      }
    };
    getAccount();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-5 h-max p-6">
      
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <div className="text-red-500 text-sm text-center">{error}</div>
      ) : supplier ? (
        <div className="w-full flex flex-col gap-5 text-sm">
          {/* Name */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={supplier.name || ""}
              disabled
              className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100"
            />
          </div>

          {/* Email */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              type="text"
              name="email"
              value={supplier.email || ""}
              disabled
              className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100"
            />
          </div>

          {/* Place */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="place" className="font-medium">Place</label>
            <input
              type="text"
              name="place"
              value={supplier.place || ""}
              disabled
              className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100"
            />
          </div>

          {/* Reliability Rating */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="reliabilityRating" className="font-medium">Reliability Rating</label>
            <input
              type="text"
              name="reliabilityRating"
              value={supplier.reliabilityRating || ""}
              disabled
              className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100"
            />
          </div>

          {/* Fraud Status */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="fraudStatus" className="font-medium">Fraud Status</label>
            <input
              type="text"
              name="fraudStatus"
              value={supplier.fraudStatus || ""}
              disabled
              className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100"
            />
          </div>

          {/* Violations */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="violations" className="font-medium">Violations</label>
            {supplier.violations.length > 0 ? (
              <ul className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100">
                {supplier.violations.map((violation, index) => (
                  <li key={index} className="list-disc ml-4">{violation}</li>
                ))}
              </ul>
            ) : (
              <input
                type="text"
                name="violations"
                value="No violations"
                disabled
                className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm text-center">No supplier data available</div>
      )}
    </div>
  );
}