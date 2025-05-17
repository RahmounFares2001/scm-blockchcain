"use client";

import { FiRefreshCcw } from "react-icons/fi";
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
import ClientOrderDetails from "./ClientOrderDetails";

// Hooks
import useGetDistributorClientOrders from "@/app/hooks/orders/useGetDistributorClientOrders";
import ShipClientOrder from "./ShipClientOrder";

export default function ClientOrdersTable() {
  const { orders, loading, error, fetchOrders } = useGetDistributorClientOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setShowDetails(false);
    setShowShipModal(false);
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
              <TableHead>Order ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expected Arrival</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No client orders available
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.clientOrder.id}>
                  <TableCell>{order.clientOrder.id}</TableCell>
                  <TableCell>{order.clientOrder.clientName}</TableCell>
                  <TableCell>{order.order.productName}</TableCell>
                  <TableCell>{order.clientOrder.clientProductQuantity}</TableCell>
                  <TableCell>{formatDate(order.clientOrder.shouldArriveToClientAt)}</TableCell>
                  <TableCell
                    className={`${
                      order.clientOrder.isArrivedToClient
                        ? "text-green-700"
                        : order.clientOrder.isShippedToClient
                        ? "text-orange-700"
                        : "text-yellow-700"
                    } font-bold`}
                  >
                    {order.clientOrder.isArrivedToClient
                      ? "Delivered"
                      : order.clientOrder.isShippedToClient
                      ? "Shipped"
                      : "Pending"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        className="w-20 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
                      >
                        Details
                      </button>
                      {!order.clientOrder.isShippedToClient && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowShipModal(true);
                          }}
                          className="w-20 py-1 bg-blue-700 rounded-lg hover:bg-blue-600 text-white"
                        >
                          Ship
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Page 1/1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {showDetails && selectedOrder && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-40">
          <ClientOrderDetails data={selectedOrder} onClose={handleClose} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}

      {showShipModal && selectedOrder && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-40">
          <ShipClientOrder data={selectedOrder} onClose={handleClose} fetchOrders={fetchOrders} />
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
            onClick={handleClose}
          ></div>
        </div>
      )}
    </>
  );
}