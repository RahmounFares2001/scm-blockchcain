"use client";

import { setUi } from "@/app/globalRedux/features/ui/uiSlice";
import useUpdateSupplier from "@/app/hooks/suppliers/useUpdateSupplier";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

export default function UpdateSupplierForm({UpdateSupplierData}) {
  const dispatch = useDispatch();


  const { updateSupplier, loading, error, success } = useUpdateSupplier();

  const validationSchema = Yup.object().shape({
    supplierAddress: Yup.string()
      .required("Supplier Address is required")
      .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    name: Yup.string().required("Name is required"),
    reliabilityRating: Yup.number()
      .required("Reliability Rating is required")
      .min(1, "Minimum rating is 1")
      .max(5, "Maximum rating is 5"),
    isFraud: Yup.string().required("Status is required"),
    place: Yup.string().required("Place is required"),
    emailAddress: Yup.string().email("Invalid email").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      supplierAddress: UpdateSupplierData.supplierAddress,
      name: UpdateSupplierData.oldName,
      reliabilityRating: UpdateSupplierData.oldReliabilityRating,
      isFraud: UpdateSupplierData.oldIsFraud,
      place: UpdateSupplierData.oldPlace,
      emailAddress: UpdateSupplierData.oldEmailAddress,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await updateSupplier(
        values.supplierAddress,
        values.name,
        values.reliabilityRating,
        values.isFraud,
        values.place,
        values.emailAddress
      );
      dispatch(setUi({key: "showUpdateSupplierForm", value: false}));
      if (success) resetForm();

    },
  });

  return (
    <div className="bg-white w-2/6 px-10 py-8 rounded shadow-md shadow-gray-400 z-50
                    flex flex-col justify-center items-center gap-5 ">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-5 text-sm" >
        <h1 className="font-bold">Update Supplier</h1>

        {/* Supplier Address */}
        {/* <div className="w-full flex flex-col gap-2">
          <label htmlFor="supplierAddress">Supplier Address</label>
          <input
            type="text"
            name="supplierAddress"
            value={formik.values.supplierAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Supplier Address"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.supplierAddress && formik.errors.supplierAddress && (
            <p className="text-red-500 text-xs">{formik.errors.supplierAddress}</p>
          )}
        </div> */}

        {/* Name */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Supplier Name"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs">{formik.errors.name}</p>
          )}
        </div>

        {/* Reliability Rating */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="reliabilityRating">Reliability Rating</label>
          <input
            type="number"
            name="reliabilityRating"
            value={formik.values.reliabilityRating}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min="1"
            max="5"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.reliabilityRating && formik.errors.reliabilityRating && (
            <p className="text-red-500 text-xs">{formik.errors.reliabilityRating}</p>
          )}
        </div>

        {/* Fraud Status */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="isFraud">Status</label>
          <select
            name="isFraud"
            value={formik.values.isFraud}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          >
            <option value="Reliable">Reliable</option>
            <option value="Fraud">Fraud</option>
            <option value="Under Review">Under Review</option>
          </select>
          {formik.touched.isFraud && formik.errors.isFraud && (
            <p className="text-red-500 text-xs">{formik.errors.isFraud}</p>
          )}
        </div>

        {/* Place */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="place">Place</label>
          <input
            type="text"
            name="place"
            value={formik.values.place}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Supplier Place"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.place && formik.errors.place && (
            <p className="text-red-500 text-xs">{formik.errors.place}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="emailAddress">Email Address</label>
          <input
            type="email"
            name="emailAddress"
            value={formik.values.emailAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email Address"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
          {formik.touched.emailAddress && formik.errors.emailAddress && (
            <p className="text-red-500 text-xs">{formik.errors.emailAddress}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center items-center">
          <button
            className="w-3/5 px-10 py-3 bg-primary text-gray-200 hover:bg-gray-100 hover:text-black border-primary hover:border-gray-200 rounded-md shadow-md font-bold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Supplier"}
          </button>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">Supplier updated successfully!</p>}
      </form>
    </div>
  );
}
