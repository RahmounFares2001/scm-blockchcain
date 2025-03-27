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
import useGetManufacturerMaterialOrders from "@/app/hooks/suppliers/useGetManufacturerMaterialOrders";

// Components
import MaterialOrderDetails from "./MaterialOrderDetails";
import Action from "./Action";

export function MaterialOrdersTable() {
  const { orders, loading, error, fetchOrders } = useGetManufacturerMaterialOrders();
  const [clickedData, setClickedData] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showAction, setShowAction] = useState(false);

  // Handle click for Details button
  const handleOrderClick = (order) => {
    setClickedData(order);
    setShowOrderDetails(true);
  };

  // Handle click for Action button
  const handleActionClick = (order) => {
    setClickedData(order);
    setShowAction(true);
  };

  // Close handler for modals
  const handleClose = () => {
    setShowOrderDetails(false);
    setShowAction(false);
    setClickedData(null); 
  };

  return (
    <>
      <div className="w-full flex">
        <button
          className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
          onClick={fetchOrders}
        >
          Refresh Orders
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
              <TableHead>ID</TableHead>
              <TableHead>Material Name</TableHead>
              <TableHead>Quantity Ordered</TableHead>
              <TableHead>Quantity Received</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.materialName}</TableCell>
                <TableCell>{order.quantityOrdered}</TableCell>
                <TableCell>{order.quantityReceived}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell
                  className={`${
                    order.status === "Pending"
                      ? "text-yellow-700"
                      : order.status === "Shipped"
                      ? "text-blue-700"
                      : order.status === "Delivered"
                      ? "text-green-700"
                      : "text-red-700"
                  } font-bold`}
                >
                  {order.status}
                </TableCell>
                <TableCell>{order.supplierName}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="w-20 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
                    >
                      Details
                    </button>
                    {order.status === "Shipped" && 
                    <button
                      onClick={() => handleActionClick(order)}
                      className="w-20 py-1 bg-blue-700 rounded-lg hover:bg-blue-600 text-white"
                    >
                      Action
                    </button>}
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

      {showOrderDetails && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <MaterialOrderDetails data={clickedData} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}

      {showAction && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <Action data={clickedData} onClose={handleClose} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}
    </>
  );
}