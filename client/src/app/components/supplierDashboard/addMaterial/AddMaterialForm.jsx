"use client";

import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup"; 

// costum hooks
import useAddMaterial from "@/app/hooks/suppliers/useAddMaterial";


export default function AddMaterialForm() {
  const { addMaterial, loading, error, success } = useAddMaterial();

  // validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    quantityAvailable: Yup.number()
      .required("Quantity is required")
      .integer("Quantity must be an integer")
      .min(1, "Quantity must be at least 1"),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      quantityAvailable: "",
    },
    validationSchema, 
    onSubmit: async (values, actions) => {
      const success = await addMaterial(
        values.name,
        values.description,
        values.price,
        values.quantityAvailable
      );
      if (success) {
        alert("Material added successfully!"); 
        actions.resetForm(); 
      }
    },
  });

  return (
    <div className="flex flex-col justify-center items-center gap-5 h-max">
      <form
        autoComplete="off"
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-5 text-sm"
      >
        {/* Name */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Name"
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
        </div>

        {/* Description */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Description"
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg"
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">{formik.errors.description}</div>
          ) : null}
        </div>

        {/* Price */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="price">Price in USD</label>
          <input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Price"
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg"
          />
          {formik.touched.price && formik.errors.price ? (
            <div className="text-red-500 text-sm">{formik.errors.price}</div>
          ) : null}
        </div>

        {/* Quantity Available */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="quantityAvailable">Quantity Available</label>
          <input
            type="number"
            name="quantityAvailable"
            value={formik.values.quantityAvailable}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Quantity Available"
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg"
          />
          {formik.touched.quantityAvailable && formik.errors.quantityAvailable ? (
            <div className="text-red-500 text-sm">{formik.errors.quantityAvailable}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="w-3/5 px-10 py-3 bg-primary text-gray-200 hover:bg-green-800 rounded-md shadow-md shadow-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Material..." : "Add Material"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="text-green-500 text-sm text-center">
            Material added successfully!
          </div>
        )}
      </form>
    </div>
  );
}