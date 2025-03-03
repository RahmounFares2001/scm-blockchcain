"use client";

import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

// hooks
import useCreateRawMaterialOrder from '@/app/hooks/suppliers/useCreateRawMaterialOrder';
import useGetAllMaterials from '@/app/hooks/suppliers/useGetAllMaterials';


export default function CreateRawMaterialOrderForm() {
  const { createOrderRawMaterial, loading } = useCreateRawMaterialOrder();
  const { materials, loading: materialsLoading, error: materialsError } = useGetAllMaterials();
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Filter available materials
  const availableMaterials = materials.filter(material => 
    material.quantityAvailable > 0 && !material.isDeleted && material.isAvailable
  );

  // Validation 
  const validationSchema = Yup.object({
    supplierAddress: Yup.string()
      .required('Supplier Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    manufacturerAddress: Yup.string()
      .required('Manufacturer Address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    materialId: Yup.string()
      .required('Material selection is required'),
    quantityOrdered: Yup.number()
      .required('Quantity Ordered is required')
      .positive('Must be positive number')
      .test('max-quantity', 'Exceeds available quantity', function(value) {
        return selectedMaterial ? value <= selectedMaterial.quantityAvailable : false;
      }),
    shouldArriveAt: Yup.string()
      .required('Arrival Date is required')
  });

  // Formik 
  const formik = useFormik({
    initialValues: {
      supplierAddress: '',
      manufacturerAddress: '',
      materialId: '',
      materialPrice: '',
      quantityOrdered: '',
      shouldArriveAt: ''
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      const success = await createOrderRawMaterial(
        values.supplierAddress,
        values.manufacturerAddress,
        selectedMaterial.name,
        selectedMaterial.id.toString(),
        values.quantityOrdered,
        selectedMaterial.price,
        Math.floor(new Date(values.shouldArriveAt).getTime() / 1000)
      );
      
      if (success) {
        alert('Raw material order created successfully!');
        actions.resetForm();
        setSelectedMaterial(null);
      }
    },
  });

  // Handle material selection
  useEffect(() => {
    if (formik.values.materialId) {
      const material = availableMaterials.find(m => m.id.toString() === formik.values.materialId);
      setSelectedMaterial(material);
      formik.setFieldValue('materialPrice', material?.price || '');
    }
  }, [formik.values.materialId]);

  return (
    <div className='flex flex-col justify-center items-center gap-5 h-max'>
      <form
        autoComplete='off'
        onSubmit={formik.handleSubmit}
        className='w-full flex flex-col gap-5 text-sm'
      >
        {/* Supplier Address */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="supplierAddress">Supplier Address</label>
          <input
            type="text"
            name='supplierAddress'
            value={formik.values.supplierAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Supplier Address'
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
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

        {/* Material Selection */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="materialId">Select Material</label>
          <select
            name='materialId'
            value={formik.values.materialId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg'
            disabled={materialsLoading || materialsError}
          >
            <option value="">Select a Material</option>
            {availableMaterials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name} (ID: {material.id}, Price: {material.price}, Available: {material.quantityAvailable})
              </option>
            ))}
          </select>
          {formik.touched.materialId && formik.errors.materialId && (
            <div className="text-red-500 text-sm">{formik.errors.materialId}</div>
          )}
          {materialsError && (
            <div className="text-red-500 text-sm">Error loading materials</div>
          )}
        </div>

        {/* Material Price (Disabled) */}
        {selectedMaterial && (
          <div className='w-full flex flex-col gap-2'>
            <label>Unit Price</label>
            <input
              type="text"
              value={selectedMaterial.price}
              className='border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg bg-gray-100'
              disabled
            />
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
            disabled={!selectedMaterial}
          />
          {formik.touched.quantityOrdered && formik.errors.quantityOrdered && (
            <div className="text-red-500 text-sm">{formik.errors.quantityOrdered}</div>
          )}
          {selectedMaterial && (
            <div className="text-sm text-gray-500">
              Available: {selectedMaterial.quantityAvailable}
            </div>
          )}
        </div>

        {/* Arrival Date */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="shouldArriveAt">Arrival Date</label>
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
            disabled={loading || materialsLoading || !formik.isValid}
            className='w-3/5 px-10 py-3 bg-primary text-gray-200 hover:bg-green-800 rounded-md shadow-md shadow-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating Order...' : 'Create Raw Material Order'}
          </button>
        </div>
      </form>
    </div>
  );
}