"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllMaterialsOrders() {
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

      // Connect to the contract
      const contract = await createEthereumContract("SupplierManagement"); // Replace with the correct contract name
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      // Fetch all raw material orders
      const data = await contract.getAllMaterialsOrders();

      // Format the orders
      const formattedOrders = data.map((order) => ({
        id: order.id.toString(),
        supplierAddress: order.supplierAddress,
        manufacturerAddress: order.manufacturerAddress,
        materialName: order.materialName,
        materialId: order.materialId,
        quantityOrdered: order.quantityOrdered.toString(),
        quantityReceived: order.quantityReceived.toString(),
        price: order.price.toString(),
        shippedAt: new Date(order.shippedAt * 1000).toLocaleString(), 
        shouldArriveAt: new Date(order.shouldArriveAt * 1000).toLocaleString(),
        arrivedAt: new Date(order.arrivedAt * 1000).toLocaleString(),
        status: order.status,
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, fetchOrders };
}