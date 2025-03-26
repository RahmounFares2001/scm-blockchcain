"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllDistributorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract("OrderManagement");
      if (!contract) {
        setError("Error connecting to the OrderManagement contract");
        return;
      }

      const userContract = await createEthereumContract("UserManagement");
      if (!userContract) {
        setError("Error connecting to the UserManagement contract");
        return;
      }

      // Fetch distributor-specific orders
      const ordersData = await contract.getAllDistributorOrders();

      const manufacturerMap = {};

      // Fetch manufacturer details for name mapping
      try {
        const rawManufacturers = await userContract.getAllManufacturers();
        if (rawManufacturers) {
          for (let i = 0; i < rawManufacturers.addresses.length; i++) {
            try {
              manufacturerMap[rawManufacturers.addresses[i]] = rawManufacturers.names[i] || `Manufacturer ${i + 1}`;
            } catch (err) {
              console.error("Error processing manufacturer:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching manufacturer data:", err);
      }

      // Format the orders data
      const formattedOrders = ordersData.map((item) => {
        const producedDate = item.producedAt ? new Date(Number(item.producedAt) * 1000) : null;
        const shippedDate = item.shippedToDistributorAt ? new Date(Number(item.shippedToDistributorAt) * 1000) : null;
        const arrivedDate = item.arrivedToDistributorAt ? new Date(Number(item.arrivedToDistributorAt) * 1000) : null;

        const order = {
          id: Number(item.id),
          manufacturerAddress: item.manufacturerAddress,
          distributorAddress: item.distributorAddress,
          productName: item.productName,
          productQuantity: Number(item.productQuantity),
          productHash: Number(item.productHash),
          orderStatus: item.orderStatus,
          isProduced: item.isProduced,
          producedAt: producedDate ? producedDate.toLocaleString() : "Not produced yet",
          isShippedToDistributor: item.isShippedToDistributor,
          shippedToDistributorAt: shippedDate ? shippedDate.toLocaleString() : "Not shipped yet",
          isArrivedToDistributor: item.isArrivedToDistributor,
          arrivedToDistributorAt: arrivedDate ? arrivedDate.toLocaleString() : "Not arrived yet",
        };

        order.manufacturerName = manufacturerMap[order.manufacturerAddress] || "Unknown Manufacturer";

        return order;
      });

      setOrders(formattedOrders);
    } catch (err) {
      setError("Failed to fetch distributor orders.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, fetchOrders };
}