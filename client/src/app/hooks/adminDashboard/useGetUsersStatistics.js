import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

const useGetUsersStatistics = () => {
  const [supplierCount, setSupplierCount] = useState(0);
  const [manufacturerCount, setManufacturerCount] = useState(0);
  const [distributorCount, setDistributorCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsersStatistics = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract();
      const [suppliers, manufacturers, distributors] = await contract.getUsersStatistics();

      setSupplierCount(suppliers.toNumber());
      setManufacturerCount(manufacturers.toNumber());
      setDistributorCount(distributors.toNumber());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersStatistics();
  }, []);

  return {
    supplierCount,
    manufacturerCount,
    distributorCount,
    loading,
    error,
    fetchUsersStatistics,
  };
};

export default useGetUsersStatistics;