"use client";

// hooks
import useGetAllManufacturers from "@/app/hooks/manufacturers/useGetAllManufacturers";

// icons 
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
} from "@/components/ui/table"
import { useState } from "react";

export function ManufacturersTable() {
  const { manufacturers, loading, error, refetch } = useGetAllManufacturers();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(manufacturers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const data = manufacturers.map((manufacturer) => ({
    address: manufacturer.address,
    name: manufacturer.name,
    emailAddress: manufacturer.email,
    place: manufacturer.place,
  }));

  const paginatedData = data.slice(startIndex, endIndex);

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
          onClick={refetch}
        >
          Refresh Manufacturers
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
              <TableHead>Email Address</TableHead>
              <TableHead>Place</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No manufacturers available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.address}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.emailAddress}</TableCell>
                  <TableCell>{item.place}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                Page {currentPage}/{totalPages}
              </TableCell>
              <TableCell className="text-right">
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
    </>
  );
}