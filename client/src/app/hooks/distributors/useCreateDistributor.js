import { useState } from "react";

import { createEthereumContract } from "@/app/utils/constants";

const useCreateDistributor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDistributor = async (distributorAddress, name, place) => {
    try {
      setLoading(true);
      setError(null);

      const contract = await createEthereumContract(); // Get contract instance

      const tx = await contract.createDistributor(distributorAddress, name, place);
      await tx.wait();

      alert("Distributor created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createDistributor, loading, error };
};

export default useCreateDistributor;
