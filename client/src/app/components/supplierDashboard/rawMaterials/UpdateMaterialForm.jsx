"use client";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useState } from "react";
import useUpdateMaterial from "@/app/hooks/suppliers/useUpdateMaterial";


export default function UpdateMaterialForm({ data, onClose }) {
  const { updateMaterial, loading, error, success } = useUpdateMaterial();
  console.log(data);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string(),
    description: Yup.string(),
    price: Yup.number(),
    quantityAvailable: Yup.number()
      .integer("Quantity must be an integer")
      .min(1, "Quantity must be at least 1"),
    updatePriceRaison: Yup.string(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      description: data?.description || "",
      price: data?.price || "",
      quantityAvailable: data?.quantityAvailable?.toString() || "",
      updatePriceRaison: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const params = {
        id: parseInt(data.id, 10),
        name: values.name || data.name,
        price: values.price ? parseFloat(values.price) : parseFloat(data.price),
        quantityAvailable: values.quantityAvailable ? parseInt(values.quantityAvailable, 10) : parseInt(data.quantityAvailable, 10),
        updatePriceRaison: values.updatePriceRaison,
        shouldUpdate: "price"
      };

      const success = await updateMaterial(params);


    },
  });


  // handle change
  const [changingType, setChangingType] = useState("price");

  return (
    <div className="bg-white w-2/6 px-10 py-8 rounded shadow-md shadow-gray-400 z-50 flex flex-col justify-center items-center gap-5">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-5 text-sm">
        <h1 className="font-bold">Update Material</h1>

        {/* Name */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            disabled={true}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Material Name"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs">{formik.errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <input
            name="description"
            disabled={true}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Material Description"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-xs">{formik.errors.description}</p>
          )}
        </div>

        <div className="flex gap-5 justify-between w-full" >
          <div className={`text-gray-100 w-1/2 py-2 rounded-xl font-bold hover:bg-indigo-700 hover:text-gray-200 text-center cursor-pointer
                    ${changingType == "price" ? "bg-indigo-800" : "bg-gray-400 text-gray-800"}`}
                onClick={()=> {setChangingType("price")}} >
              Change Price
          </div>

          <div className={`text-gray-100 w-1/2 py-2 rounded-xl font-bold hover:bg-green-700 hover:text-gray-200 text-center cursor-pointer
                    ${changingType == "quantity" ? "bg-green-800" : "bg-gray-400 text-gray-800"}`}
                onClick={()=> {setChangingType("quantity")}} >
            Change Quantity
          </div>
        </div>

        {/* Quantity Available */}
        {changingType == "quantity" ? 
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="quantityAvailable">Quantity Available</label>
          <input
            type="number"
            name="quantityAvailable"
            value={formik.values.quantityAvailable}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Quantity Available"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.quantityAvailable && formik.errors.quantityAvailable && (
            <p className="text-red-500 text-xs">{formik.errors.quantityAvailable}</p>
          )}
        </div>

        : <>
        {/* New Price */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="price">New Price in USD</label>
          <input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter New Price"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-red-500 text-xs">{formik.errors.price}</p>
          )}
        </div>

        {/* Update Price Reason */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="updatePriceRaison">Price Update Reason</label>
          <input
            type="text"
            name="updatePriceRaison"
            value={formik.values.updatePriceRaison}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Price Update Reason"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.updatePriceRaison && formik.errors.updatePriceRaison && (
            <p className="text-red-500 text-xs">{formik.errors.updatePriceRaison}</p>
          )}
        </div>
        </>}

        {/* Submit Button */}
        <div className="w-full flex justify-center items-center">
          <button
            className="w-3/5 px-10 py-3 bg-primary text-gray-200 hover:bg-gray-100 hover:text-black border-primary hover:border-gray-200 rounded-md shadow-md font-bold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Material"}
          </button>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">Material updated successfully!</p>}
      </form>
    </div>
  );
}