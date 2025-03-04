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

// components
import CreateRawMaterialOrderForm from "../materialOrders/CreateMaterialOrderForm";

// hooks
import useGetAllMaterials from "@/app/hooks/suppliers/useGetAllMaterials";
import SupplierDetails from "./SupplierDetails";
import UpdateSupplierForm from "./UpdateSupplierForm";

export function SuppliersTable() {
  const { materials, loading, error, fetchMaterials } = useGetAllMaterials();
  const [clickedData, setClickedData] = useState(null);


  // handle 
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showSupplierDetails, setShowSupplierDetails] = useState(false);

  return (
    <>
      <div className="w-full flex">
        <button
          className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
          onClick={fetchMaterials}
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
              <TableHead className="font-medium">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity Available</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Reliability Rating</TableHead>
              <TableHead>Fraud Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((item) => (
              <TableRow key={item.material.id}>
                <TableCell className="font-medium">{item.material.id}</TableCell>
                <TableCell>{item.material.name}</TableCell>
                <TableCell>{item.material.description}</TableCell>
                <TableCell>${item.material.price}</TableCell>
                <TableCell>{item.material.quantityAvailable}</TableCell>
                <TableCell>{item.supplier.name}</TableCell>
                <TableCell>{item.supplier.reliabilityRating}</TableCell>
                <TableCell
                  className={`${
                    item.supplier.isFraud === "Fraud"
                      ? "text-red-700"
                      : item.supplier.isFraud === "Reliable"
                      ? "text-green-700"
                      : "text-yellow-700"
                  } font-bold`}
                >
                  {item.supplier.isFraud}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setClickedData(item);
                        setShowUpdateForm(true);
                      }}
                      className="w-16 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-white"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setClickedData(item);
                        setShowDetailsForm(true);
                      }}
                      className="w-24 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
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
              <TableCell colSpan={9}>Page 1/1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {showUpdateForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center overflow-auto">
          <UpdateSupplierForm data={clickedData} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={() => {
              setShowOrderForm(false);
              setShowSupplierDetails(false);
            }}
          ></div>
        </div>
      )}

      {showSupplierDetails && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center overflow-auto">
          <SupplierDetails data={clickedData} /> 
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={() => {
              setShowOrderForm(false);
              setShowSupplierDetails(false);
            }}
          ></div>
        </div>
      )}
    </>
  );
}