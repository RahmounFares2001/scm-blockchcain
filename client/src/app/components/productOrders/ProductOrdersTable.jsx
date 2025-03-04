"use client";

// hooks
import useGetAllOrders from "@/app/hooks/orders/useGetAllOrders";

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

  
  export function ProductOrdersTable() {
     // get orders
  const { orders, loading, error, refreshOrders } = useGetAllOrders();

    return (
      <>
      <div className="w-full flex" >
        <button className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90
                flex justify-center items-center gap-3"
                onClick={refreshOrders} >
            Refresh Orders
            <FiRefreshCcw />
        </button>
      </div>
      {loading ? 
          <h1>Loading...</h1> :
      <Table>
        <TableHeader>
          <TableRow >
            <TableHead>Order ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Distributor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right" >Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell>{order.productQuantity}</TableCell>
              <TableCell>{order.manufacturerName}</TableCell>
              <TableCell>{order.distributorName}</TableCell>
              <TableCell className={`${order.orderStatus == "Pending Production" ?
                       "text-yellow-700" : "text-green-700"} font-bold`} >
                        {order.orderStatus}
              </TableCell>
              <TableCell className="text-right" >{new Date(parseInt(order.createdAt) * 1000).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Page 1/1</TableCell>
            <TableCell className="text-right pt-3">
                <div className="flex gap-5 justify-end items-center
                            pt-3" >
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