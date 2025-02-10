import { useState } from "react";

import { createEthereumContract } from "@/app/utils/constants";

const useCreateDistributor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDistributor = async (distributorAddress, name, emailAddress, place) => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      const contract = await createEthereumContract(); 
      const tx = await contract.createDistributor(distributorAddress, name, emailAddress, place);
      await tx.wait();

      alert("Distributor created successfully!");

    } catch (err) {
      console.error("Error creating distributor:", err);
        setError(err.message);
    } finally {
        setLoading(false);
      }
    };


  return { createDistributor, loading, error };
};

export default useCreateDistributor;
