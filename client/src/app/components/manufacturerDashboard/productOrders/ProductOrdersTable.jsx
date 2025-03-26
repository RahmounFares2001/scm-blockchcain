"use client";

// Hooks
import useGetAllManufacturerOrders from "@/app/hooks/orders/useGetAllManufacturerOrders"; // Adjust path as needed

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

// Components
import OrdersDetails from "./OrdersDetails";
import ShipOrder from "./ShipOrder"; // Placeholder import
import ProduceOrder from "./ProduceOrder"; // Placeholder import

export default function ProductOrdersTable() {
  // Get orders from hook
  const { orders, loading, error, fetchOrders } = useGetAllManufacturerOrders();
  const [clickedData, setClickedData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showShipOrder, setShowShipOrder] = useState(false);
  const [showProduceOrder, setShowProduceOrder] = useState(false);

  // Handle closing all modals
  const handleClose = () => {
    setClickedData(null);
    setShowDetails(false);
    setShowShipOrder(false);
    setShowProduceOrder(false);
  };

  // Handle Details button click
  const handleDetailsClick = (order) => {
    setClickedData(order);
    setShowDetails(true);
  };

  // Handle Ship (Supply) button click
  const handleShipClick = (order) => {
    setClickedData(order);
    setShowShipOrder(true);
  };

  // Handle Produce button click
  const handleProduceClick = (order) => {
    setClickedData(order);
    setShowProduceOrder(true);
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
        <h1 className="text-red-500">Error: {error}</h1>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No orders available
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.productQuantity}</TableCell>
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
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleDetailsClick(order)}
                        className="w-20 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
                      >
                        Details
                      </button>
                      {order.orderStatus === "Pending Production" ? (
                        <button
                          onClick={() => handleProduceClick(order)}
                          className="w-20 py-1 bg-blue-700 rounded-lg hover:bg-blue-600 text-white"
                        >
                          Produce
                        </button>
                      ) : (
                        order.orderStatus === "Manufactured" && (
                          <button
                            onClick={() => handleShipClick(order)}
                            className="w-20 py-1 bg-blue-700 rounded-lg hover:bg-blue-600 text-white"
                          >
                            Supply
                          </button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Page 1/1</TableCell>
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

      {showDetails && clickedData && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-40">
          <OrdersDetails data={clickedData} onClose={handleClose} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}

      {showShipOrder && clickedData && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-40">
          <ShipOrder data={clickedData} onClose={handleClose} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}

      {showProduceOrder && clickedData && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-40">
          <ProduceOrder data={clickedData} onClose={handleClose} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}
    </>
  );
}