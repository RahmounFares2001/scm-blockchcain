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
import useGetAllMaterials from "@/app/hooks/suppliers/useGetAllMaterials";
import { useState } from "react";
import CreateRawMaterialOrderForm from "../materialOrders/CreateMaterialOrderForm";
import MaterialDetails from "../materialOrders/MaterialDetails";

export function RawMaterialsTable() {
  const { materials, loading, error, fetchMaterials } = useGetAllMaterials();
  console.log(materials)
  const [clickedData, setClickedData] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);

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
              <TableHead>Name</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Price (USD)</TableHead>
              <TableHead>Quantity Available</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Supplier Rating</TableHead>
              <TableHead>Supplier Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((item) => (
              <TableRow key={item.material.id}>
                <TableCell>{item.material.name}</TableCell>
                <TableCell className={`${item.material.isAvailable? "text-green-700": "text-yellow-700"} font-bold`} >
                    {item.material.isAvailable ? "Available" : "Not Available"}
                </TableCell>
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
                  <div className={`flex gap-1 ${!item.material.isAvailable && "justify-center"}`}>
                    {(item.material.isAvailable && item.supplier.isFraud === "Reliable") &&
                    <button
                      onClick={() => {
                        setClickedData(item);
                        setShowOrderForm(true);
                      }}
                      className="w-16 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-white"
                    >
                      Order
                    </button> }

                    <button
                      onClick={() => {
                        setClickedData(item);
                        setShowDetailsForm(true);
                      }}
                      className="w-16 py-1 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white"
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

      {showOrderForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <CreateRawMaterialOrderForm data={clickedData} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={() => setShowOrderForm(false)}
          ></div>
        </div>
      )}

      {showDetailsForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <MaterialDetails data={clickedData} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={() => setShowDetailsForm(false)}
          ></div>
        </div>
      )}
    </>
  );
}