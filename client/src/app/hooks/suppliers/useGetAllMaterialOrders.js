"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllMaterialOrders() {
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

      const ordersData = await contract.getAllMaterialsOrders();
      
      const supplierMap = {};
      const manufacturerMap = {};

      try {
        const rawSuppliers = await userContract.getAllSuppliers();
        
        if (rawSuppliers) {
          for (let i = 0; i < rawSuppliers.length; i++) {
            try {
              const supplier = rawSuppliers[i];
              const address = supplier[0];
              supplierMap[address] = `Supplier ${i+1}`;
            } catch (err) {}
          }
        }
        
        const rawManufacturers = await userContract.getAllManufacturers();
        
        if (rawManufacturers) {
          for (let i = 0; i < rawManufacturers.length; i++) {
            try {
              const manufacturer = rawManufacturers[i];
              const address = manufacturer[0];
              manufacturerMap[address] = `Manufacturer ${i+1}`;
            } catch (err) {}
          }
        }
      } catch (err) {}

      const formattedOrders = ordersData.map((item) => {
        const order = {
          id: Number(item[0]),
          supplierAddress: item[1],
          manufacturerAddress: item[2],
          materialName: item[3],
          materialId: item[4],
          quantityOrdered: Number(item[5]),
          quantityReceived: Number(item[6]),
          price: Number(item[7]),
          shippedAt: Number(item[8]),
          shouldArriveAt: Number(item[9]),
          arrivedAt: Number(item[10]),
          status: item[11],
        };

        order.supplierName = supplierMap[order.supplierAddress] || "Unknown Supplier";
        order.manufacturerName = manufacturerMap[order.manufacturerAddress] || "Unknown Manufacturer";

        return order;
      });

      setOrders(formattedOrders);
    } catch (err) {
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