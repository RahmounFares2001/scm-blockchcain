"use client";

import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup'; 
import useCreateManufacturer from '@/app/hooks/manufacturers/useCreateManufacturer';

export default function AddManufacturerForm() {
  const { createManufacturer, loading } = useCreateManufacturer();

  // Yup validation schema
  const validationSchema = Yup.object({
    manufacturerAddress: Yup.string()
      .required('Manufacturer Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    place: Yup.string()
      .required('Place is required')
      .min(2, 'Place must be at least 2 characters'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      manufacturerAddress: '',
      name: '',
      email: '',
      place: '',
    },
    validationSchema, 
    onSubmit: async (values, actions) => {
      const success = await createManufacturer(
        values.manufacturerAddress,
        values.name,
        values.email,
        values.place
      );
      if (success) {
        actions.resetForm(); 
      }
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

        {/* Name */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Name'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
        </div>

        {/* Email */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Email'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>

        {/* Place */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="place">Place</label>
          <input
            type="text"
            name='place'
            value={formik.values.place}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Place'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.place && formik.errors.place ? (
            <div className="text-red-500 text-sm">{formik.errors.place}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div className='w-full flex justify-center items-center'>
          <button
            type='submit'
            disabled={loading || !formik.isValid}
            className='w-3/5 px-10 py-3 bg-primary text-gray-200 hover:bg-green-800 rounded-md shadow-md shadow-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {loading ? 'Adding Manufacturer...' : 'Add Manufacturer'}
          </button>
        </div>
      </form>
    </div>
  );
}