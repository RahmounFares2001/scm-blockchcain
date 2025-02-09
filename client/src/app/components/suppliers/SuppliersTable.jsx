"use client";

// hooks
import useGetAllSuppliers from "@/app/hooks/suppliers/useGetAllSuppliers";

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

  
 
  
  export function SuppliersTable() {
     // get suppliers
  const { suppliers, loading, error, refreshSuppliers } = useGetAllSuppliers();

  const invoices = suppliers.map((supplier) => ({
    name: supplier.name,
    emailAddress: supplier.email,
    reliability: supplier.rating,
    isFraud: supplier.isFraud ? "Fraud" : "Trusted",
    place: supplier.place,
  }));

    return (
      <>
      <div className="w-full flex" >
        <button className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90
                flex justify-center items-center gap-3"
                onClick={()=> {refreshSuppliers()}} >
            Refresh Suppliers
            <FiRefreshCcw />
        </button>
      </div>
      {loading ? 
          <h1>Looding...</h1> :
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Reliability Rating</TableHead>
            <TableHead>Is Fraud</TableHead>
            <TableHead className="text-right">Place</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.name}</TableCell>
              <TableCell>{invoice.emailAddress}</TableCell>
              <TableCell>{invoice.reliability}</TableCell>
              <TableCell>{invoice.isFraud}</TableCell>
              <TableCell className="text-right">{invoice.place}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Page 1/1</TableCell>
            <TableCell className="text-right pt-3">
                <div className="flex gap-5 justify-end items-center
                            pt-3" >
                    <button className="w-24 py-1 border hover:bg-gray-200 rounded-md" >Previous</button>
                    <button className="w-24 py-1 border hover:bg-gray-200 rounded-md" >Next</button>
                </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>}      </>

    )
  }
  



  // {
  //   invoice: "INV002",
  //   paymentStatus: "Pending",
  //   totalAmount: "$150.00",
  //   paymentMethod: "PayPal",
  // },
  // {
  //   invoice: "INV003",
  //   paymentStatus: "Unpaid",
  //   totalAmount: "$350.00",
  //   paymentMethod: "Bank Transfer",
  // },
  // {
  //   invoice: "INV004",
  //   paymentStatus: "Paid",
  //   totalAmount: "$450.00",
  //   paymentMethod: "Credit Card",
  // },
  // {
  //   invoice: "INV005",
  //   paymentStatus: "Paid",
  //   totalAmount: "$550.00",
  //   paymentMethod: "PayPal",
  // },
  // {
  //   invoice: "INV006",
  //   paymentStatus: "Pending",
  //   totalAmount: "$200.00",
  //   paymentMethod: "Bank Transfer",
  // },
  // {
  //   invoice: "INV007",
  //   paymentStatus: "Unpaid",
  //   totalAmount: "$300.00",
  //   paymentMethod: "Credit Card",
  // },