import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

const useGetMaterialOrderStatistics = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [shippedToManufacturerCount, setShippedToManufacturerCount] = useState(0);
  const [arrivedToManufacturerCount, setArrivedToManufacturerCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterialOrderStatistics = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract();
      const [
        pending,
        shippedToManufacturer,
        arrivedToManufacturer,
        canceled,
      ] = await contract.getMaterialOrderStatistics();

      setPendingCount(pending.toNumber());
      setShippedToManufacturerCount(shippedToManufacturer.toNumber());
      setArrivedToManufacturerCount(arrivedToManufacturer.toNumber());
      setCanceledCount(canceled.toNumber());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialOrderStatistics();
  }, []);

  return {
    pendingCount,
    shippedToManufacturerCount,
    arrivedToManufacturerCount,
    canceledCount,
    loading,
    error,
    fetchMaterialOrderStatistics,
  };
};

export default useGetMaterialOrderStatistics;