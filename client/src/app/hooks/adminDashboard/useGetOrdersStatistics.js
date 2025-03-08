"use client";
import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

const useGetOrdersStatistics = () => {
  const [pendingProductionCount, setPendingProductionCount] = useState(0);
  const [manufacturedCount, setManufacturedCount] = useState(0);
  const [shippedToDistributorCount, setShippedToDistributorCount] = useState(0);
  const [arrivedToDistributorCount, setArrivedToDistributorCount] = useState(0);
  const [shippedToClientCount, setShippedToClientCount] = useState(0);
  const [deliveredToClientCount, setDeliveredToClientCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrdersStatistics = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract();
      const [
        pendingProduction,
        manufactured,
        shippedToDistributor,
        arrivedToDistributor,
        shippedToClient,
        deliveredToClient,
      ] = await contract.getOrdersStatistics();

      setPendingProductionCount(pendingProduction.toNumber());
      setManufacturedCount(manufactured.toNumber());
      setShippedToDistributorCount(shippedToDistributor.toNumber());
      setArrivedToDistributorCount(arrivedToDistributor.toNumber());
      setShippedToClientCount(shippedToClient.toNumber());
      setDeliveredToClientCount(deliveredToClient.toNumber());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersStatistics();
  }, []);

  return {
    pendingProductionCount,
    manufacturedCount,
    shippedToDistributorCount,
    arrivedToDistributorCount,
    shippedToClientCount,
    deliveredToClientCount,
    loading,
    error,
    fetchOrdersStatistics,
  };
};

export default useGetOrdersStatistics;