"use client";

import { setUi } from '@/app/globalRedux/features/ui/uiSlice';
import { createEthereumContract } from '@/app/utils/constants';
import { useFormik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';


export default function AddSupplierForm() {
    const dispatch = useDispatch();
 
    // formik
    const handleSubmit = async (values, actions) => {
        try {
            // check if MetaMask is installed
            if (!window.ethereum) {
                alert("Please install MetaMask!");
                return;
            }
    
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            const contract = await createEthereumContract();
            if(!contract) {
                alert("Failed to connect to contract");
                return;
            }
    
            console.log("Creating supplier with values:", values);
    
            const transaction = await contract.createSupplier(
                values.supplierAddress,
                values.name,
                values.place,
                values.emailAddress
            );
            
            console.log("Transaction initiated:", transaction);
            
            // Wait for transaction to be mined
            const receipt = await transaction.wait();
            console.log("Transaction receipt:", receipt);
            
            alert("Supplier created successfully!");
            actions.resetForm();
    
        } catch (error) {
            console.error("Error in supplier creation:", error);
            if (error.code === 4001) {
                alert("Transaction was rejected by user");
            } else if (error.code === -32603) {
                alert("Internal JSON-RPC error. Check if you have enough funds and correct permissions.");
            } else {
                alert(`Failed to create supplier: ${error.message}`);
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            supplierAddress: '',
            name: '',
            emailAddress: '',
            place: '',
        },
        onSubmit: handleSubmit,
    });
  return (
        <div className='flex flex-col justify-center items-center gap-5 h-max' >

            <form autoComplete='off'
                onSubmit={formik.handleSubmit}
                className='w-full flex flex-col gap-5 text-sm'>

                {/* supplier address */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="supplierAddress">Supplier Address</label>
                    <input type="text" name='supplierAddress'
                        value={formik.values.supplierAddress}
                        onChange={formik.handleChange}
                        placeholder='Supplier Address'
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                {/* name */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                 {/* email address */}
                 <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="emailAddress">Email Address</label>
                    <input type="email" name='emailAddress'
                        value={formik.values.emailAddress}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                {/* place */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="place">Place</label>
                    <input type="text" name='place'
                        value={formik.values.place}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                
                <div className='w-full flex justify-center items-center' >
                    <button className='w-3/5 px-10 py-3 bg-primary text-gray-200
                        hover:bg-green-800 rounded-md shadow-md shadow-gray-400' >Add Supplier</button>
                </div>

            </form>

        </div>

  )
}
