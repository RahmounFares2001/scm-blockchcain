"use client";

import useUpdateSupplierReliabilityOnDelay from "@/app/hooks/suppliers/useUpdateSupplierReliabilityOnDelay";
import useUpdateSupplierReliabilityOnQuantity from "@/app/hooks/suppliers/useUpdateSupplierReliabilityOnQuantity";
import { useState } from "react";

export default function ReportProblem({ data, onClose }) {
    const [reportType, setReportType] = useState(""); // "quantity", "delay", "both"
    const [quantityReceived, setQuantityReceived] = useState("");
    const [confirmDelivery, setConfirmDelivery] = useState(false);
  
    const { updateSupplierReliability, loading: delayLoading, error: delayError } = useUpdateSupplierReliabilityOnDelay();
    const { updateSupplierReliabilityOnQuantity, loading: quantityLoading, error: quantityError } = useUpdateSupplierReliabilityOnQuantity();
  
    const handleReport = async () => {
      const supplierAddress = data.supplierAddress; 
      const orderId = data.id; 
  
      try {
        if (reportType === "quantity" || reportType === "both") {
          if (!quantityReceived || isNaN(quantityReceived)) {
            alert("Please enter a valid quantity received.");
            return;
          }
          await updateSupplierReliabilityOnQuantity(supplierAddress, orderId, Number(quantityReceived));
        }
  
        if (reportType === "delay" || reportType === "both") {
          await updateSupplierReliability(supplierAddress, orderId, confirmDelivery);
        }
  
        alert("Report submitted successfully!");
        onClose(); 
      } catch (err) {
        console.error("Error submitting report:", err);
      }
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50 h-5/6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Report a Problem</h2>
  
        {/* Order Summary */}
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
            />
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
        {(delayError || quantityError) && (
          <p className="text-red-600 mt-2">{delayError || quantityError}</p>
        )}
      </div>
    );
}