"use client";

// Hooks
import useGetAllManufacturerOrders from "@/app/hooks/orders/useGetAllManufacturerOrders";

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
import ShipOrder from "./ShipOrder";
import ProduceOrder from "./ProduceOrder";

export default function ProductOrdersTable() {
  const { orders, loading, error, fetchOrders } = useGetAllManufacturerOrders();
  const [clickedData, setClickedData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showShipOrder, setShowShipOrder] = useState(false);
  const [showProduceOrder, setShowProduceOrder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  const handleClose = () => {
    setClickedData(null);
    setShowDetails(false);
    setShowShipOrder(false);
    setShowProduceOrder(false);
  };

  const handleDetailsClick = (order) => {
    setClickedData(order);
    setShowDetails(true);
  };

  const handleShipClick = (order) => {
    setClickedData(order);
    setShowShipOrder(true);
  };

  const handleProduceClick = (order) => {
    setClickedData(order);
    setShowProduceOrder(true);
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
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No orders available
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
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
              <TableCell colSpan={5}>
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