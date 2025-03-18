"use client";

import { FiRefreshCcw } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

// hooks
import useGetAllSuppliers from "@/app/hooks/suppliers/useGetAllSuppliers";
import useGetSupplierMaterialsByAddress from "@/app/hooks/suppliers/useGetSupplierMaterialsByAddress";

// components
import SupplierDetails from "./SupplierDetails";
import UpdateSupplierForm from "./UpdateSupplierForm";


export function SuppliersTable() {
  const { suppliers, loading, error, fetchSuppliers } = useGetAllSuppliers();
  const [clickedData, setClickedData] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showSupplierDetails, setShowSupplierDetails] = useState(false);

  // Fetch materials for supplier
  const {
    materials: supplierMaterials,
    loading: materialsLoading,
    error: materialsError,
    fetchMaterials: fetchSupplierMaterials,
  } = useGetSupplierMaterialsByAddress(clickedData?.supplier?.address);

  // Handle click
  const handleSupplierClick = async (supplier) => {
    const data = { supplier, materials: [] };
    setClickedData(data);

    await fetchSupplierMaterials();

    setClickedData((prev) => ({ ...prev, materials: supplierMaterials }));
    setShowSupplierDetails(true);
  };

  return (
    <>
      <div className="w-full flex">
        <button
          className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
          onClick={fetchSuppliers}
        >
          Refresh Suppliers
          <FiRefreshCcw />
        </button>
      </div>

      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1 className="text-red-500">{error}</h1>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Reliability Rating</TableHead>
              <TableHead>Fraud Status</TableHead>
              <TableHead>Place</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Violations</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.address}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.reliabilityRating}</TableCell>
                <TableCell
                  className={`${
                    supplier.fraudStatus === "Fraud"
                      ? "text-red-700"
                      : supplier.fraudStatus === "Reliable"
                      ? "text-green-700"
                      : "text-yellow-700"
                  } font-bold`}
                >
                  {supplier.fraudStatus}
                </TableCell>
                <TableCell>{supplier.place}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.violations.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setClickedData({ supplier, materials: [] });
                        setShowUpdateForm(true);
                      }}
                      className="w-20 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-white"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleSupplierClick(supplier)}
                      className="w-20 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
                    >
                      Details
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Page 1/1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {showUpdateForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center overflow-auto">
          <UpdateSupplierForm data={clickedData} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={() => setShowUpdateForm(false)}
          ></div>
        </div>
      )}

      {showSupplierDetails && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center overflow-auto">
          <SupplierDetails data={clickedData} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={() => setShowSupplierDetails(false)}
          ></div>
        </div>
      )}
    </>
  );
}