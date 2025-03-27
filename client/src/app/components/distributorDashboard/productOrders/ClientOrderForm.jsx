"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAddClientOrder from "@/app/hooks/orders/useAddClientOrder";

// Yup validation schema
const validationSchema = Yup.object({
  clientName: Yup.string().required("Client name is required"),
  clientAddress: Yup.string()
    .required("Client address is required"),
  clientProductQuantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  shouldArriveToClientAt: Yup.date()
    .min(new Date(), "Date must be in the future")
    .required("Expected arrival date is required"),
});

export default function ClientOrderForm({ data, onClose, fetchOrders }) {
  const { addClientOrder, loading, error, success } = useAddClientOrder();

  // Initial form values
  const initialValues = {
    clientName: "",
    clientAddress: "",
    clientProductQuantity: "",
    shouldArriveToClientAt: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    const orderId = data.id; 
    const shouldArriveToClientAtTimestamp = Math.floor(
      new Date(values.shouldArriveToClientAt).getTime() / 1000
    ); // Convert to Unix timestamp

    await addClientOrder(
      orderId,
      values.clientName,
      values.clientAddress,
      values.clientProductQuantity,
      shouldArriveToClientAtTimestamp
    );

    if (success) {
      fetchOrders(); 
      onClose(); 
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 overflow-auto z-50">
      <h2 className="text-2xl font-bold mb-4">Add Client Order</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Order ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Order ID</label>
              <p className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                {data.id}
              </p>
            </div>

            {/* Client Name */}
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <Field
                type="text"
                name="clientName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name="clientName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Client Address */}
            <div>
              <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">
                Client Address
              </label>
              <Field
                type="text"
                name="clientAddress"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name="clientAddress" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Client Product Quantity */}
            <div>
              <label htmlFor="clientProductQuantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <Field
                type="number"
                name="clientProductQuantity"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="clientProductQuantity"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Should Arrive To Client At */}
            <div>
              <label htmlFor="shouldArriveToClientAt" className="block text-sm font-medium text-gray-700">
                Expected Arrival Date
              </label>
              <Field
                type="date"
                name="shouldArriveToClientAt"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="shouldArriveToClientAt"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Feedback */}
            {loading && <p className="text-blue-700">Adding order...</p>}
            {error && <p className="text-red-700">{error}</p>}
            {success && <p className="text-green-700">Order added successfully!</p>}

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className={`px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 ${
                  loading || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading || isSubmitting}
              >
                Submit
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
    </div>
  );
}