"use client";

import useCreateOrder from '@/app/hooks/orders/useCreateOrder';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup'; 

export default function CreateOrderForm() {
  const { createOrder, loading } = useCreateOrder();

  // Yup validation schema
  const validationSchema = Yup.object({
    manufacturerAddress: Yup.string()
      .required('Manufacturer Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    distributorAddress: Yup.string()
      .required('Distributor Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    productName: Yup.string()
      .required('Product Name is required')
      .min(2, 'Product Name must be at least 2 characters'),
    productQuantity: Yup.number()
      .required('Product Quantity is required')
      .positive('Product Quantity must be a positive number'),
  });

  // Formik 
  const formik = useFormik({
    initialValues: {
      manufacturerAddress: '',
      distributorAddress: '',
      productName: '',
      productQuantity: '',
    },
    validationSchema, 
    onSubmit: async (values, actions) => {
      await createOrder(
        values.manufacturerAddress,
        values.distributorAddress,
        values.productName,
        values.productQuantity
      );
      actions.resetForm(); 
    },
  });

  return (
    <div className='flex flex-col justify-center items-center gap-5 h-max'>
      <form
        autoComplete='off'
        onSubmit={formik.handleSubmit}
        className='w-full flex flex-col gap-5 text-sm'
      >
        {/* Manufacturer Address */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="manufacturerAddress">Manufacturer Address</label>
          <input
            type="text"
            name='manufacturerAddress'
            value={formik.values.manufacturerAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Manufacturer Address'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.manufacturerAddress && formik.errors.manufacturerAddress ? (
            <div className="text-red-500 text-sm">{formik.errors.manufacturerAddress}</div>
          ) : null}
        </div>

      

        {/* Distributor Address */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="distributorAddress">Distributor Address</label>
          <input
            type="text"
            name='distributorAddress'
            value={formik.values.distributorAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Distributor Address'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.distributorAddress && formik.errors.distributorAddress ? (
            <div className="text-red-500 text-sm">{formik.errors.distributorAddress}</div>
          ) : null}
        </div>


        {/* Product Name */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            name='productName'
            value={formik.values.productName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Product Name'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.productName && formik.errors.productName ? (
            <div className="text-red-500 text-sm">{formik.errors.productName}</div>
          ) : null}
        </div>

        {/* Product Quantity */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="productQuantity">Product Quantity</label>
          <input
            type="number"
            name='productQuantity'
            value={formik.values.productQuantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Product Quantity'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.productQuantity && formik.errors.productQuantity ? (
            <div className="text-red-500 text-sm">{formik.errors.productQuantity}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div className='w-full flex justify-center items-center'>
          <button
            type='submit'
            disabled={loading || !formik.isValid}
            className='w-3/5 px-10 py-3 bg-primary text-gray-200 hover:bg-green-800 rounded-md shadow-md shadow-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}