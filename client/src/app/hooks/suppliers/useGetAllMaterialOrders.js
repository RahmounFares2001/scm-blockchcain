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

      const contract = await createEthereumContract();
      if (!contract) {
        setError("Error connecting to the contract");
        return;
      }

      const data = await contract.getAllMaterialsOrders();

      const formattedOrders = data.map((order) => ({
        id: order.id.toNumber(),
        supplierAddress: order.supplierAddress,
        supplierName: order.supplierName,
        manufacturerAddress: order.manufacturerAddress,
        manufacturerName: order.manufacturerName,
        materialName: order.materialName,
        materialId: order.materialId.toString(),
        quantityOrdered: order.quantityOrdered.toNumber(),
        quantityReceived: order.quantityreceived.toNumber(),
        price: order.price.toNumber(),
        shippedAt: order.shippedAt.toNumber(),
        shouldArriveAt: order.shouldArriveAt.toNumber(),
        arrivedAt: order.arrivedAt.toNumber(),
        isShipped: order.isShipped,
        isDelivered: order.isDelivered,
        isCanceled: order.isCanceled,
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching material orders:", err);
      setError("Failed to fetch material orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, fetchOrders };
}
