"use client";

import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';

// hooks
import useCreateRawMaterialOrder from '@/app/hooks/suppliers/useCreateRawMaterialOrder';


export default function CreateRawMaterialOrderForm({ data: clickedData }) {
  const { createOrderRawMaterial, loading } = useCreateRawMaterialOrder();

  // Validation schema
  const validationSchema = Yup.object({
    supplierAddress: Yup.string()
      .required('Supplier Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    manufacturerAddress: Yup.string()
      .required('Manufacturer Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    quantityOrdered: Yup.number()
      .required('Quantity Ordered is required')
      .positive('Must be a positive number')
      .max(
        clickedData?.material.quantityAvailable || 0,
        'Exceeds available quantity'
      ),
    shouldArriveAt: Yup.string()
      .required('Arrival Date is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      supplierAddress: clickedData?.material.supplierAddress || '',
      manufacturerAddress: '',
      quantityOrdered: '',
      shouldArriveAt: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      if(clickedData.material.quantityAvailable < values.quantityOrdered ) {
        alert("Low stock of Raw Materials available") 
      } 
      const success = await createOrderRawMaterial(
        values.supplierAddress,
        values.manufacturerAddress,
        clickedData.material.name,
        clickedData.material.id.toString(),
        values.quantityOrdered,
        parseFloat(clickedData.material.price),
        Math.floor(new Date(values.shouldArriveAt).getTime() / 1000)
      );

      if (success) {
        alert('Raw material order created successfully!');
        actions.resetForm();
      }
    },
  });

  // Pre-fill supplier address if available
  useEffect(() => {
    if (clickedData) {
      formik.setFieldValue('supplierAddress', clickedData.material.supplierAddress);
    }
  }, [clickedData]);

  return (
    <div className='flex flex-col justify-center items-center gap-5 w-1/2
             z-50 bg-white rounded-lg h-4/5'>
      <form
        autoComplete='off'
        onSubmit={formik.handleSubmit}
        className='w-full px-10 py-8  flex flex-col gap-5 text-sm overflow-auto'
      >
        {/* Supplier Address (disabled) */}
        <div className='w-full flex flex-col gap-2'>
          <h1 className='font-bold text-xl pb-3' >Order Raw Material</h1>
          <label htmlFor="supplierAddress">Supplier Address</label>
          <input
            type="text"
            name='supplierAddress'
            value={formik.values.supplierAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Supplier Address'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100'
            disabled
          />
          {formik.touched.supplierAddress && formik.errors.supplierAddress && (
            <div className="text-red-500 text-sm">{formik.errors.supplierAddress}</div>
          )}
        </div>

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
          {formik.touched.manufacturerAddress && formik.errors.manufacturerAddress && (
            <div className="text-red-500 text-sm">{formik.errors.manufacturerAddress}</div>
          )}
        </div>

        {/* Material Details (Read-only) */}
        {clickedData && (
          <div className='w-full flex flex-col gap-2'>
            <label>Material Details</label>
            <div className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100'>
              <p><strong>Name: </strong> {clickedData.material.name}</p>
              <p><strong>Price: </strong> ${clickedData.material.price}</p>
              <p><strong>Available Quantity: </strong> {clickedData.material.quantityAvailable}</p>
            </div>
          </div>
        )}

        {/* Quantity Ordered */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="quantityOrdered">Quantity Ordered</label>
          <input
            type="number"
            name='quantityOrdered'
            value={formik.values.quantityOrdered}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Quantity Ordered'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.quantityOrdered && formik.errors.quantityOrdered && (
            <div className="text-red-500 text-sm">{formik.errors.quantityOrdered}</div>
          )}
          {clickedData && (
            <div className="text-sm text-gray-500">
              Available: {clickedData.material.quantityAvailable}
            </div>
          )}
        </div>

        {/* Arrival Date */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="shouldArriveAt">Arrival To Manufacturer At</label>
          <input
            type="date"
            name='shouldArriveAt'
            value={formik.values.shouldArriveAt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.shouldArriveAt && formik.errors.shouldArriveAt && (
            <div className="text-red-500 text-sm">{formik.errors.shouldArriveAt}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className='w-full flex justify-center items-center'>
          <button
            type='submit'
            disabled={loading || !formik.isValid}
            className='w-3/5 px-10 py-3 bg-primary text-gray-200 hover:bg-green-800 rounded-md shadow-md shadow-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating Order...' : 'Create Raw Material Order'}
          </button>
        </div>
      </form>
    </div>
  );
}