"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      setLoading(true);
      setError(null);

      const orderContract = await createEthereumContract("OrderManagement");
      if (!orderContract) {
        throw new Error("Error connecting to the OrderManagement contract");
      }

      const userContract = await createEthereumContract("UserManagement");
      if (!userContract) {
        throw new Error("Error connecting to the UserManagement contract");
      }

      const data = await orderContract.getAllOrders();

      // Fetch manufacturer and distributor names
      const manufacturerMap = {};
      const distributorMap = {};

      const manufacturers = await userContract.getAllManufacturers();
      manufacturers.addresses.forEach((addr, i) => {
        manufacturerMap[addr] = manufacturers.names[i] || "Unknown Manufacturer";
      });

      const distributors = await userContract.getAllDistributors();
      distributors.addresses.forEach((addr, i) => {
        distributorMap[addr] = distributors.names[i] || "Unknown Distributor";
      });

      // Format the orders based on the Order struct
      const formattedOrders = data.map((order) => {
        // Convert timestamps to readable format
        const producedAt = order.producedAt > 0 ? new Date(Number(order.producedAt) * 1000).toLocaleString() : "Not produced yet";
        const shippedAt = order.shippedToDistributorAt > 0 ? new Date(Number(order.shippedToDistributorAt) * 1000).toLocaleString() : "Not shipped yet";
        const arrivedAt = order.arrivedToDistributorAt > 0 ? new Date(Number(order.arrivedToDistributorAt) * 1000).toLocaleString() : "Not arrived yet";

        return {
          id: Number(order.id), 
          manufacturerAddress: order.manufacturerAddress,
          manufacturerName: manufacturerMap[order.manufacturerAddress] || "Unknown Manufacturer",
          isProduced: order.isProduced,
          producedAt: producedAt,
          isShippedToDistributor: order.isShippedToDistributor,
          shippedToDistributorAt: shippedAt,
          distributorAddress: order.distributorAddress,
          distributorName: distributorMap[order.distributorAddress] || "Unknown Distributor",
          isArrivedToDistributor: order.isArrivedToDistributor,
          arrivedToDistributorAt: arrivedAt,
          productName: order.productName,
          productQuantity: Number(order.productQuantity), 
          productHash: Number(order.productHash), 
          orderStatus: order.orderStatus,
        };
      });

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refreshOrders: fetchOrders };
}