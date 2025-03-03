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
import { useDispatch, useSelector } from "react-redux";
import { setUi } from "@/app/globalRedux/features/ui/uiSlice";
import UpdateSupplierForm from "./UpdateSupplierForm";
import { useState } from "react";

  
 
  
  export function SuppliersTable() {
     // get suppliers
  const { suppliers, loading, error, refreshSuppliers } = useGetAllSuppliers();

  const data = suppliers.map((supplier) => ({
    address: supplier.address,
    name: supplier.name,
    emailAddress: supplier.email,
    reliability: supplier.rating,
    isFraud: supplier.isFraud,
    place: supplier.place,
  }));


  // redux 
  const dispatch = useDispatch();
  
  const showUpdateSupplierForm = useSelector((state)=> state.ui.showUpdateSupplierForm);


  const [ UpdateSupplierData, setUpdateSupplierData] = useState(
    {
      supplierAddress: "",
      oldName: "",
      oldReliabilityRating: 0,
      oldIsFraud: "",
      oldPlace: "",
      oldEmailAddress: ""
    }
  );

    return (
      <>
      <div className="w-full flex" >
        <button className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90
                flex justify-center items-center gap-3"
                onClick={()=> {refreshSuppliers}} >
            Refresh Suppliers
            <FiRefreshCcw />
        </button>
      </div>
      {loading ? 
          <h1>Looding...</h1> :
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Reliability Rating</TableHead>
            <TableHead>Is Fraud</TableHead>
            <TableHead>Place</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.item}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.emailAddress}</TableCell>
              <TableCell className={`${item.reliability > 3 ? "text-green-700" : 
                       "text-red-700"} font-bold`} >
                      {item.reliability}
              </TableCell>
              
              <TableCell className={`${item.isFraud == "Reliable" ? "text-green-700" : 
                      item.isFraud == "Fraud" ? "text-red-700": "text-yellow-700"} font-bold`}
                       >{item.isFraud}
              </TableCell>
                       
              <TableCell >{item.place}</TableCell>

              <TableCell className="text-center">
                <button className="px-5 py-1 bg-green-700 rounded-lg
                      hover:bg-green-600"
                      onClick={()=> {
                        dispatch(setUi({key:"showUpdateSupplierForm", value: true}));
                        setUpdateSupplierData(prevData =>  ({
                          ...prevData,
                          supplierAddress: item.address,
                          oldName: item.name,
                          oldReliabilityRating: item.reliability,
                          oldIsFraud: item.isFraud,
                          oldPlace: item.place,
                          oldEmailAddress: item.emailAddress
                        }))}} >
                    Update
                </button>
              </TableCell>
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
      
      {showUpdateSupplierForm &&
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center overflow-auto" >
            <UpdateSupplierForm UpdateSupplierData={UpdateSupplierData} />

            <div className="fixed top-0 left-0 w-full h-full bg-black/90 z-30"
                        onClick={()=> {dispatch(setUi({key:"showUpdateSupplierForm", value: false}))}} >
            </div>

        </div> }
      </>

    )
  }
  