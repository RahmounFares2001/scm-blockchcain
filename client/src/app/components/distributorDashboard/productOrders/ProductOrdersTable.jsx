"use client";

// Hooks
import useGetAllDistributorOrders from "@/app/hooks/orders/useGetAllDistributorOrders";

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
import DistributorConfirmDelivery from "./DistributorConfirmDelivery";
import ClientOrderForm from "./ClientOrderForm";

export default function ProductOrdersTable() {
  const { orders, loading, error, fetchOrders } = useGetAllDistributorOrders();
  const [clickedData, setClickedData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmDelivery, setShowConfirmDelivery] = useState(false);
  const [showClientOrderForm, setShowClientOrderForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // Handle closing all modals
  const handleClose = () => {
    setClickedData(null);
    setShowDetails(false);
    setShowConfirmDelivery(false);
    setShowClientOrderForm(false);
  };

  // Handle Details button click
  const handleDetailsClick = (order) => {
    setClickedData(order);
    setShowDetails(true);
  };

  // Handle Confirm button click
  const handleConfirmClick = (order) => {
    setClickedData(order);
    setShowConfirmDelivery(true);
  };

  // Handle Order button click
  const handleOrderClick = (order) => {
    setClickedData(order);
    setShowClientOrderForm(true);
  };

  // Handle pagination navigation
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
              <TableHead>Manufacturer</TableHead>
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
                  <TableCell>{order.manufacturerName}</TableCell>
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
                      {order.orderStatus === "Shipped to Distributor" ? (
                        <button
                          onClick={() => handleConfirmClick(order)}
                          className="w-20 py-1 bg-blue-700 rounded-lg hover:bg-blue-600 text-white"
                        >
                          Confirm
                        </button>
                      ) : (
                        order.orderStatus === "Arrived to Distributor" && (
                          <button
                            onClick={() => handleOrderClick(order)}
                            className="w-20 py-1 bg-blue-700 rounded-lg hover:bg-blue-600 text-white"
                          >
                            Order
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

      {showConfirmDelivery && clickedData && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-40">
          <DistributorConfirmDelivery data={clickedData} onClose={handleClose} fetchOrders={fetchOrders} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}

      {showClientOrderForm && clickedData && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <ClientOrderForm data={clickedData} onClose={handleClose} fetchOrders={fetchOrders} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}
    </>
  );
}