"use client";

import useCreateDistributor from '@/app/hooks/distributors/useCreateDistributor';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup'; 


export default function AddDistributorForm() {
  const { createDistributor, loading } = useCreateDistributor();

  // Yup validation schema
  const validationSchema = Yup.object({
    distributorAddress: Yup.string()
      .required('Distributor Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    emailAddress: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    place: Yup.string()
      .required('Place is required')
      .min(2, 'Place must be at least 2 characters'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      distributorAddress: '',
      name: '',
      emailAddress: '',
      place: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      const success = await createDistributor(
        values.distributorAddress,
        values.name,
        values.emailAddress,
        values.place
      );
      if (success) {
        alert('Distributor created successfully!'); 
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

        {/* Email Address */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            type="email"
            name='emailAddress'
            value={formik.values.emailAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Email Address'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
          />
          {formik.touched.emailAddress && formik.errors.emailAddress ? (
            <div className="text-red-500 text-sm">{formik.errors.emailAddress}</div>
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
            {loading ? 'Adding Distributor...' : 'Add Distributor'}
          </button>
        </div>
      </form>
    </div>
  );
}