"use client";

// Hooks
import useGetAllClientOrders from "@/app/hooks/orders/useGetAllClientOrders";

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
} from "@/components/ui/table";
import { useState } from "react";

// Assuming ClientOrdersDetails is a component you'll create
import ClientOrdersDetails from "./ClientOrdersDetails";

export function ClientOrdersTable() {
  // Get client orders from hook
  const { clientOrders, loading, error, refreshClientOrders } = useGetAllClientOrders();
  const [clickedData, setClickedData] = useState(null);
  console.log(clickedData);
    

  // Handle closing the details modal
  const handleClose = () => {
    setClickedData(null);
  };

  // Function to determine the combined status
  const getCombinedStatus = (clientOrder) => {
    const { order, clientOrder: co } = clientOrder;
    
    // Derive client order status
    if (co.isArrivedToClient && co.deliveredToClientAt !== "0") {
      return "Delivered to Client";
    }
    if (co.isShippedToClient && co.shippedToClientAt !== "0") {
      return "Shipped to Client";
    }
    if (order.status === "Arrived to Distributor") {
      return "Pending Shipment to Client";
    }
    
    // Fall back to order status
    return order.status;
  };

  return (
    <>
      <div className="w-full flex">
        <button
          className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
          onClick={refreshClientOrders}
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
              <TableHead>Client Name</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No client orders available
                </TableCell>
              </TableRow>
            ) : (
              clientOrders.map((clientOrder) => {
                const status = getCombinedStatus(clientOrder);
                return (
                  <TableRow key={clientOrder.clientOrder.id}>
                    <TableCell className="font-medium">{clientOrder.clientOrder.id}</TableCell>
                    <TableCell>{clientOrder.order.productName}</TableCell>
                    <TableCell>{clientOrder.clientOrder.clientProductQuantity}</TableCell>
                    <TableCell>{clientOrder.clientOrder.clientName}</TableCell>
                    <TableCell>{clientOrder.order.manufacturerName || "N/A"}</TableCell>
                    <TableCell>{clientOrder.order.distributorName || "N/A"}</TableCell>
                    <TableCell
                      className={`${
                        status === "Pending Production"
                          ? "text-yellow-700"
                          : status === "Manufactured"
                          ? "text-blue-700"
                          : status === "Shipped to Distributor"
                          ? "text-purple-700"
                          : status === "Arrived to Distributor"
                          ? "text-green-700"
                          : status === "Pending Shipment to Client"
                          ? "text-orange-700"
                          : status === "Shipped to Client"
                          ? "text-indigo-700"
                          : status === "Delivered to Client"
                          ? "text-teal-700"
                          : "text-red-700"
                      } font-bold`}
                    >
                      {status}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => setClickedData(clientOrder)}
                        className="w-20 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
                      >
                        Details
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Page 1/1</TableCell>
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
          <ClientOrdersDetails data={clickedData} onClose={handleClose} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}
    </>
  );
}