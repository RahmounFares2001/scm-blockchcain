"use client";
import React from 'react'

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useConfirmRawMaterialReception from '@/app/hooks/suppliers/useConfirmRawMaterialReception';

export default function ConfirmReception({data, onClose}) {
    const { confirmRawMaterialReception, loading, error, success } = useConfirmRawMaterialReception();

  // Validation schema for the confirm form
  const validationSchema = Yup.object({
    confirm: Yup.boolean()
      .oneOf([true], "You must confirm the reception")
      .required("Confirmation is required"),
  });

  // Handle form submission
  const handleConfirmSubmit = async (values, { setSubmitting }) => {
    if (values.confirm) {
      await confirmRawMaterialReception(data.id);
      if (success) {
        onClose(); 
      }
    }
    setSubmitting(false);
  };
  return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50 h-5/6 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Confirm Material Reception</h2>
          <div className="mb-6 px-5 py-4 bg-indigo-800 text-white rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              <p><strong>ID:</strong> {data.id}</p>
              <p><strong>Material Name:</strong> {data.materialName}</p>
              <p><strong>Quantity Ordered:</strong> {data.quantityOrdered}</p>
              <p><strong>Status:</strong> {data.status}</p>
              <p><strong>Supplier:</strong> {data.supplierName}</p>
              <p><strong>Shipped At:</strong> {data.shippedAt}</p>
            </div>
          </div>

          <Formik
            initialValues={{ confirm: false }}
            validationSchema={validationSchema}
            onSubmit={handleConfirmSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="confirm" className="form-checkbox h-5 w-5" />
                    <span>I confirm the reception of the material</span>
                  </label>
                  <ErrorMessage name="confirm" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {loading && <p className="text-blue-700 mb-2">Confirming reception...</p>}
                {error && <p className="text-red-700 mb-2">{error}</p>}
                {success && <p className="text-green-700 mb-2">Reception confirmed successfully!</p>}

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 ${
                      loading || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading || isSubmitting}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 ${
                      loading || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading || isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>  )
}
