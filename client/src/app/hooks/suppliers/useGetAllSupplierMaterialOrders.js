"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllSupplierMaterialOrders() {
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

      // Fetch supplier-specific raw material orders
      const ordersData = await contract.getAllSupplierMaterialOrders();
      console.log(ordersData);
      const supplierMap = {};
      const manufacturerMap = {};

      // Fetch supplier and manufacturer details for name mapping
      try {
        const rawSuppliers = await userContract.getAllSuppliers();
        if (rawSuppliers) {
          for (let i = 0; i < rawSuppliers.length; i++) {
            try {
              const supplier = rawSuppliers[i];
              const address = supplier[0]; 
              supplierMap[address] = `Supplier ${i + 1}`;
            } catch (err) {
              console.error("Error processing supplier:", err);
            }
          }
        }

        const rawManufacturers = await userContract.getAllManufacturers();
        if (rawManufacturers) {
          for (let i = 0; i < rawManufacturers.length; i++) {
            try {
              const manufacturer = rawManufacturers[i];
              const address = manufacturer[0]; 
              manufacturerMap[address] = `Manufacturer ${i + 1}`;
            } catch (err) {
              console.error("Error processing manufacturer:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
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
        order.manufacturerName = manufacturerMap[order.manufacturerAddress] || "Unknown Manufacturer";

        return order;
      });

      setOrders(formattedOrders);
    } catch (err) {
      setError("Failed to fetch supplier material orders.");
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