"use client";

import { useState, useEffect } from "react";
import { createEthereumContract } from "@/app/utils/constants";

export default function useGetAllSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = async () => {
    try {
      if (!window.ethereum) {
        alert("Veuillez installer MetaMask !");
        return;
      }

      setLoading(true);
      setError(null);

      const contract = await createEthereumContract();
      if (!contract) {
        setError("Erreur de connexion au contrat");
        return;
      }

      const data = await contract.getAllSuppliers();

      const formattedSuppliers = data[0].map((_, index) => ({
        address: data[0][index],
        name: data[1][index],
        rating: data[2][index].toString(),
        isFraud: data[3][index],
        place: data[4][index],
        email: data[5][index],
        violations: data[6][index],
      }));

      setSuppliers(formattedSuppliers);
    } catch (err) {
      console.error("Erreur lors de la récupération des fournisseurs :", err);
      setError("Impossible de charger les fournisseurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, refreshSuppliers: fetchSuppliers };
}
