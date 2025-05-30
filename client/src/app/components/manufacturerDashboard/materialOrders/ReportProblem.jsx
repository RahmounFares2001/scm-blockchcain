"use client";

import useGetManufacturerByAddress from "@/app/hooks/manufacturers/useGetManufacturerByAddress";
import useGetSupplierByAddress from "@/app/hooks/suppliers/useGetSupplierByAddress";
import useUpdateSupplierReliabilityOnDelay from "@/app/hooks/suppliers/useUpdateSupplierReliabilityOnDelay";
import useUpdateSupplierReliabilityOnQuantity from "@/app/hooks/suppliers/useUpdateSupplierReliabilityOnQuantity";
import { useState } from "react";

export default function ReportProblem({ data, onClose }) {
  // Data hooks
  const { supplier, loadingSupplier, errorSupplier } = useGetSupplierByAddress(data.supplierAddress);
  const { manufacturer, loadingManufacturer, errorManufacturer } = useGetManufacturerByAddress(data.manufacturerAddress);

  // State for report
  const [reportType, setReportType] = useState(""); // "quantity", "delay", "both"
  const [quantityReceived, setQuantityReceived] = useState("");
  const [confirmDelivery, setConfirmDelivery] = useState(false);

  const { updateSupplierReliability, loading: delayLoading, error: delayError } = useUpdateSupplierReliabilityOnDelay();
  const { updateSupplierReliabilityOnQuantity, loading: quantityLoading, error: quantityError } = useUpdateSupplierReliabilityOnQuantity();

  // Handle report submission
  const handleReport = async () => {
    if (!reportType) {
      alert("Please select a report type.");
      return;
    }

    const supplierAddress = data.supplierAddress;
    const orderId = data.id;

    try {
      if (reportType === "quantity" || reportType === "both") {
        if (!quantityReceived || isNaN(quantityReceived) || quantityReceived < 0) {
          alert("Please enter a valid quantity received.");
          return;
        }
        await updateSupplierReliabilityOnQuantity(supplierAddress, orderId, Number(quantityReceived));
      }

      if (reportType === "delay" || reportType === "both") {
        await updateSupplierReliability(supplierAddress, orderId, confirmDelivery);
      }

      // Send email via API route
      const response = await fetch("/api/mailer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          order: data,
          supplier,
          manufacturer,
          quantityReceived,
          confirmDelivery,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      alert("Report submitted successfully!");
      onClose();
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50 h-5/6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Report a Problem</h2>

      {/* Order Details */}
      <div className="mb-6 px-5 py-4 bg-indigo-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Order Details</h3>
        <ul className="space-y-2">
          <li><strong>ID:</strong> {data.id}</li>
          <li><strong>Material Name:</strong> {data.materialName}</li>
          <li><strong>Quantity Ordered:</strong> {data.quantityOrdered}</li>
          <li><strong>Quantity Received:</strong> {data.quantityReceived}</li>
          <li><strong>Price:</strong> {data.price}</li>
          <li><strong>Status:</strong> {data.status}</li>
          <li><strong>Shipped At:</strong> {data.shippedAt}</li>
          <li><strong>Expected Arrival:</strong> {data.shouldArriveAt}</li>
          <li><strong>Arrival Status:</strong> {data.arrivedAt}</li>
        </ul>
      </div>


      {/* Report Type Selection */}
      <div className="mb-4">
        <label className="block mb-2">Select Report Type:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select an option</option>
          <option value="quantity">Report on Quantity</option>
          <option value="delay">Report on Delay</option>
          <option value="both">Report on Both</option>
        </select>
      </div>

      {/* Quantity Input */}
      {(reportType === "quantity" || reportType === "both") && (
        <div className="mb-4">
          <label className="block mb-2">Quantity Received:</label>
          <input
            type="number"
            value={quantityReceived}
            onChange={(e) => setQuantityReceived(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter quantity received"
            min="0"
          />
          {quantityReceived && Number(quantityReceived) < data.quantityOrdered && (
            <p className="text-yellow-600 mt-2">
              Supplier delivered {quantityReceived} units, less than the {data.quantityOrdered} units ordered.
            </p>
          )}
        </div>
      )}

      {/* Delay Confirmation Option */}
      {(reportType === "delay" || reportType === "both") && (
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={confirmDelivery}
              onChange={(e) => setConfirmDelivery(e.target.checked)}
              className="form-checkbox h-5 w-5"
            />
            <span>Confirm Delivery with Delay Report</span>
          </label>
          {data.arrivedAt === "Not arrived yet" && !confirmDelivery && (
            <p className="text-yellow-600 mt-2">
              Order has not arrived by expected date: {data.shouldArriveAt}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleReport}
          className={`py-2 px-4 bg-blue-700 text-white rounded-lg hover:bg-blue-600 ${
            delayLoading || quantityLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={delayLoading || quantityLoading}
        >
          {delayLoading || quantityLoading ? "Submitting..." : "Submit Report"}
        </button>
        <button
          onClick={onClose}
          className={`py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ${
            delayLoading || quantityLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={delayLoading || quantityLoading}
        >
          Cancel
        </button>
      </div>

      {/* Error Messages */}
      {(delayError || quantityError || errorSupplier || errorManufacturer) && (
        <p className="text-red-600 mt-2">
          {delayError || quantityError || errorSupplier || errorManufacturer}
        </p>
      )}
    </div>
  );
}