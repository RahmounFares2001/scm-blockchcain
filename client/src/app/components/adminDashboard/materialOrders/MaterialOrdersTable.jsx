"use client";

// icons 
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
  } from "@/components/ui/table"

// hooks
import useGetAllMaterialOrders from "@/app/hooks/suppliers/useGetAllMaterialOrders";

  
  export function MaterialOrdersTable() {
     // get material orders
  const { orders, loading, error, fetchOrders } = useGetAllMaterialOrders();

  const data = orders.map((order) => ({
    id: order.id,
    supplierName: order.supplierName,
    manufacturerName: order.manufacturerName,
    materialName: order.materialName,
    quantityOrdered: order.quantityOrdered,
    quantityReceived: order.quantityReceived,
    price: order.price,
    isShipped: order.isShipped,
    isDelivered: order.isDelivered,
    isCanceled: order.isCanceled,
  }));

    return (
      <>
      <div className="w-full flex" >
        <button className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90
                flex justify-center items-center gap-3"
                onClick={fetchOrders} >
            Refresh Material Orders
            <FiRefreshCcw />
        </button>
      </div>
      {loading ? 
          <h1>Loading...</h1> :
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
            <TableHead className="text-right" >Status</TableHead>
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
              <TableCell className="text-right" >
                {item.isCanceled ? (
                  <span className="text-red-500">Canceled</span>
                ) : item.isDelivered ? (
                  <span className="text-green-500">Delivered</span>
                ) : item.isShipped ? (
                  <span className="text-yellow-500">Shipped</span>
                ) : (
                  <span className="text-gray-500">Pending</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Page 1/1</TableCell>
            <TableCell className="text-right pt-3">
                <div className="flex gap-5 justify-end items-center pt-3" >
                    <button className="w-24 py-1 border hover:bg-gray-200 rounded-md" >Previous</button>
                    <button className="w-24 py-1 border hover:bg-gray-200 rounded-md" >Next</button>
                </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>}      
      </>
    )
  }