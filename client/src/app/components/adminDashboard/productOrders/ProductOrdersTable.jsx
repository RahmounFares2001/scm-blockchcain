"use client";

// Hooks
import useGetAllOrders from "@/app/hooks/orders/useGetAllOrders";

// Icons
import { FiRefreshCcw } from "react-icons/fi";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Ensure all required components are imported
import { useState } from "react";

// Assuming OrdersDetails is a component you'll create
import OrdersDetails from "./OrdersDetails"; // Adjust path as needed

export function ProductOrdersTable() {
  // Get orders from hook
  const { orders, loading, error, refreshOrders } = useGetAllOrders();
  const [clickedData, setClickedData] = useState(null);

  // Handle closing the details modal
  const handleClose = () => {
    setClickedData(null);
  };

  return (
    <>
      <div className="w-full flex">
        <button
          className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
          onClick={refreshOrders}
        >
          Refresh Orders
          <FiRefreshCcw />
        </button>
      </div>

      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1 className="text-red-500">Error: {error}</h1>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No orders available
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.productQuantity}</TableCell>
                  <TableCell>{order.manufacturerName}</TableCell>
                  <TableCell>{order.distributorName}</TableCell>
                  <TableCell
                    className={`${
                      order.orderStatus === "Pending Production"
                        ? "text-yellow-700"
                        : order.orderStatus === "Manufactured"
                        ? "text-blue-700"
                        : order.orderStatus === "Shipped to Distributor"
                        ? "text-purple-700"
                        : order.orderStatus === "Arrived to Distributor"
                        ? "text-green-700"
                        : "text-red-700"
                    } font-bold`}
                  >
                    {order.orderStatus}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setClickedData(order)}
                      className="w-20 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
                    >
                      Details
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Page 1/1</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-5 justify-end items-center">
                  <button
                    className="w-24 py-1 border hover:bg-gray-200 rounded-md disabled:opacity-50"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className="w-24 py-1 border hover:bg-gray-200 rounded-md disabled:opacity-50"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {clickedData && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <OrdersDetails data={clickedData} onClose={handleClose} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}
    </>
  );
}