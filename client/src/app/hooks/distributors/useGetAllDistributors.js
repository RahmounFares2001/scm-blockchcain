import { useState, useEffect } from "react";

import { createEthereumContract } from "@/app/utils/constants";

const useGetAllDistributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDistributors = async () => {
    try {
      setLoading(true);
      setError(null);

      const contract = await createEthereumContract(); 
      const data = await contract.getAllDistributors();

      const formattedDistributors = data[0].map((_, index) => ({
        address: data[0][index],
        name: data[1][index],
        place: data[2][index],
      }));

      setDistributors(formattedDistributors);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  return { distributors, loading, error, fetchDistributors };
};

export default useGetAllDistributors;
