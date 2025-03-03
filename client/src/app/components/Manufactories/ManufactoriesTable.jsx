"use client";

// hooks

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
import useGetAllManufacturers from "@/app/hooks/manufacturers/useGetAllManufacturers";

  
  export function ManufacturersTable() {
     // get manufacturers
  const { manufacturers, loading, error, refetch } = useGetAllManufacturers();

  const data = manufacturers.map((manufacturer) => ({
    address: manufacturer.address,
    name: manufacturer.name,
    emailAddress: manufacturer.email,
    place: manufacturer.place,
  }));

    return (
      <>
      <div className="w-full flex" >
        <button className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90
                flex justify-center items-center gap-3"
                onClick={refetch} >
            Refresh Manufacturers
            <FiRefreshCcw />
        </button>
      </div>
      {loading ? 
          <h1>Loading...</h1> :
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Place</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.address}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.emailAddress}</TableCell>
              <TableCell>{item.place}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Page 1/1</TableCell>
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