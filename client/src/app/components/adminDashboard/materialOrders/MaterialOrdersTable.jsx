"use client";

// icons 
import { FiRefreshCcw } from "react-icons/fi";
import { useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// hooks
import useGetAllMaterialOrders from "@/app/hooks/suppliers/useGetAllMaterialOrders";
import MaterialOrderDetails from "./MaterialOrderDetails";

export function MaterialOrdersTable() {
    // get material orders
    const { orders, loading, error, fetchOrders } = useGetAllMaterialOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);
  console.log(selectedOrder)
    const formatDate = (dateString) => dateString?.split(",")[0];

    const data = orders.map((order) => ({
        id: order.id,
        supplierName: order.supplierName,
        manufacturerName: order.manufacturerName,
        materialName: order.materialName,
        quantityOrdered: order.quantityOrdered,
        quantityReceived: order.quantityReceived,
        price: order.price,
        shippedAt: formatDate(order.shippedAt),
        shouldArriveAt: formatDate(order.shouldArriveAt),
        arrivedAt: formatDate(order.arrivedAt),
        status: order.status,
    }));

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Shipped':
                return <span className="text-yellow-600 font-bold">Shipped</span>;
            case 'Delivered':
                return <span className="text-green-600 font-bold">Delivered</span>;
            case 'Canceled':
                return <span className="text-red-600 font-bold">Canceled</span>;
            default:
                return <span className="text-yellow-600 font-bold">Pending</span>;
        }
    };

    return (
        <>
            <div className="w-full flex ">
                <button 
                    className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
                    onClick={fetchOrders}
                >
                    Refresh Material Orders
                    <FiRefreshCcw />
                </button>
            </div>
            
            {loading ? (
                <h1>Loading...</h1>
            ) : error ? (
                <div className="text-red-500">Error: {error}</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Manufacturer</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantity Ordered</TableHead>
                            <TableHead>Quantity Received</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.supplierName}</TableCell>
                                <TableCell>{item.manufacturerName}</TableCell>
                                <TableCell>{item.materialName}</TableCell>
                                <TableCell>{item.quantityOrdered}</TableCell>
                                <TableCell>{item.quantityReceived}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>
                                    {getStatusBadge(item.status)}
                                </TableCell>
                                {/* Details Button */}
                                <TableCell className="text-right">
                                    <button
                                        className="w-20 py-1 bg-yellow-700 rounded-lg hover:bg-yellow-600 text-white"
                                        onClick={() => setSelectedOrder(item)}
                                    >
                                        Details
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Show details modal when an order is selected */}
            {selectedOrder && 
              <>
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center ">
                  <MaterialOrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                <div
                  className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
                  onClick={() => setSelectedOrder(null)}>  
                </div>
              </div>

              </>}
        </>
    );
}
