"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetManufacturerMaterialOrders() {
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

      // Fetch manufacturer-specific raw material orders
      const ordersData = await contract.getManufacturerMaterialOrders();

      const supplierMap = {};

      // Fetch supplier details for name mapping
      try {
        const rawSuppliers = await userContract.getAllSuppliers();
        if (rawSuppliers) {
          for (let i = 0; i < rawSuppliers.addresses.length; i++) {
            try {
              supplierMap[rawSuppliers.addresses[i]] = rawSuppliers.names[i] || `Supplier ${i + 1}`;
            } catch (err) {
              console.error("Error processing supplier:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching supplier data:", err);
      }

      // Format the orders data
      const formattedOrders = ordersData.map((item) => {
        const shouldArriveDate = new Date(Number(item.shouldArriveAt) * 1000);
        const shippedDate = item.shippedAt ? new Date(Number(item.shippedAt) * 1000) : null;
        const arrivedDate = item.arrivedAt ? new Date(Number(item.arrivedAt) * 1000) : null;

        const order = {
          id: Number(item.id),
          supplierAddress: item.supplierAddress,
          manufacturerAddress: item.manufacturerAddress,
          materialName: item.materialName,
          materialId: item.materialId,
          quantityOrdered: Number(item.quantityOrdered),
          quantityReceived: Number(item.quantityreceived),
          price: Number(item.price),
          shippedAt: shippedDate ? shippedDate.toLocaleString() : "Not shipped yet",
          shouldArriveAt: shouldArriveDate ? shouldArriveDate.toLocaleString() : "Not specified",
          arrivedAt: arrivedDate ? arrivedDate.toLocaleString() : "Not arrived yet",
          status: item.status,
        };

        order.supplierName = supplierMap[order.supplierAddress] || "Unknown Supplier";

        return order;
      });

      setOrders(formattedOrders);
    } catch (err) {
      setError("Failed to fetch manufacturer material orders.");
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