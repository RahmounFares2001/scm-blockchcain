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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMaterials = materials.slice(startIndex, endIndex);

  const handleRefresh = async () => {
    await fetchSupplierMaterials();
  };

  const handleUpdateClick = (material) => {
    setClickedMaterial(material);
    setShowUpdateForm(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
            {paginatedMaterials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No materials available
                </TableCell>
              </TableRow>
            ) : (
              paginatedMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell>{material.price}</TableCell>
                  <TableCell>{material.quantityAvailable}</TableCell>
                  <TableCell
                    className={`${material.isAvailable ? "text-green-700" : "text-yellow-700"} font-bold`}
                  >
                    {material.isAvailable ? "Available" : "Not Available"}
                  </TableCell>
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
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                Page {currentPage}/{totalPages}
              </TableCell>
              <TableCell colSpan={2} className="text-right">
                <div className="flex gap-5 justify-end items-center">
                  <button
                    className="w-24 py-1 border hover:bg-gray-200 rounded-md disabled:opacity-50"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="w-24 py-1 border hover:bg-gray-200 rounded-md disabled:opacity-50"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </TableCell>
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