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

// Hooks
import useGetSupplierMaterials from "@/app/hooks/suppliers/useGetSupplierMaterials";

// Components
import UpdateMaterialForm from "./UpdateMaterialForm";

export function MaterialsTable() {
  const { materials, loading, error, fetchSupplierMaterials } = useGetSupplierMaterials();
  const [clickedMaterial, setClickedMaterial] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  console.log(materials)

  // Handle refresh
  const handleRefresh = async () => {
    await fetchSupplierMaterials();
  };

  // Handle update button click
  const handleUpdateClick = (material) => {
    setClickedMaterial(material);
    setShowUpdateForm(true);
  };

  return (
    <>
      <div className="w-full flex">
        <button
          className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
          onClick={handleRefresh}
        >
          Refresh Materials
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
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell>{material.price}</TableCell>
                <TableCell>{material.quantityAvailable}</TableCell>
                <TableCell className={`${material.isAvailable ? "text-green-700": "text-yellow-700"} font-bold`}
                    >{material.isAvailable ? "Available" : "Not Available"}</TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => handleUpdateClick(material)}
                      className="w-20 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-white"
                    >
                      Update
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Page 1/1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {showUpdateForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center overflow-auto">
          <UpdateMaterialForm
            data={clickedMaterial}
            onClose={() => setShowUpdateForm(false)}
          />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={() => setShowUpdateForm(false)}
          ></div>
        </div>
      )}
    </>
  );
}