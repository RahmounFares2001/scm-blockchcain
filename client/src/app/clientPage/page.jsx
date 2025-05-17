"use client";

import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { IoHomeOutline } from "react-icons/io5";
import { RiArrowGoBackLine } from "react-icons/ri";
import Link from "next/link";
import useGetOrderById from "../hooks/orders/useGetOrderById";
import useClientConfirmDelivery from "../hooks/orders/useClientConfirmDelivery";

export default function TrackPage() {
  const [trackMethod, setTrackMethod] = useState("");
  const [orderId, setOrderId] = useState("");
  const { order, loading, error: fetchError, fetchClientOrder, reset } = useGetOrderById();
  const { clientConfirmDelivery, loading: confirmLoading, error: confirmError, success } = useClientConfirmDelivery();
  console.log(order)
  // QR Code (unchanged)
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (isScannerActive && videoRef.current) {
      qrScannerRef.current = new QrScanner(videoRef.current, (result) => {
        setScanResult(result);
        stopScanner();
      }, {
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });

      qrScannerRef.current.start().catch((err) => {
        setError("Camera access denied or no camera found");
        console.error(err);
        stopScanner();
      });
    }

    return () => {
      if (qrScannerRef.current) {
        stopScanner();
      }
    };
  }, [isScannerActive]);

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScannerActive(false);
  };

  const startScanning = () => {
    setScanResult("");
    setError("");
    setIsScannerActive(true);
  };

  // Handle tracking by ID
  const handleTrackById = () => {
    if (orderId) {
      console.log("Fetching order with ID:", orderId);
      fetchClientOrder(Number(orderId));
    }
  };

  // Close handler for both button and overlay
  const handleClose = () => {
    setOrderId("");
    reset();
  };

  // Confirm delivery handler
  const handleConfirmDelivery = () => {
    clientConfirmDelivery(Number(orderId)).then(() => {
      fetchClientOrder(Number(orderId)); // Refresh order state after confirmation
    });
  };

  // Log order state to debug
  useEffect(() => {
    console.log("Order state updated:", order);
  }, [order]);

  return (
    <section className="w-full h-dvh flex justify-center items-center bg-primary">
      <Link
        href="/"
        className="absolute top-3 left-3 w-14 h-14 border rounded-full bg-gray-100 flex justify-center items-center cursor-pointer shadow-md shadow-gray-300 hover:bg-primary hover:text-gray-200"
      >
        <RiArrowGoBackLine className="text-3xl" />
      </Link>

      <div className="w-11/12 sm:w-4/5 md:w-3/5 h-[550px] bg-white flex flex-col gap-5 px-10 py-8 rounded-lg shadow-lg shadow-gray-500">
        <h1 className="text-center font-bold text-gray-900">Track & Confirm Reception of your product</h1>
        <hr className="border-primary" />

        <div className="flex flex-col gap-5">
          <h1>Choose method of tracking</h1>
          <div className="flex gap-10 w-full text-gray-200 items-center text-sm sm:text-lg">
            <button
              className={`${trackMethod === "trackByCodeQR" ? "bg-gray-100" : "bg-primary"} py-2 w-1/2 rounded-lg hover:bg-primary/90`}
              onClick={() => setTrackMethod("trackById")}
            >
              By ID
            </button>
            <button
              className={`${trackMethod === "trackById" ? "bg-gray-100" : "bg-primary"} py-2 w-1/2 rounded-lg hover:bg-primary/90`}
              onClick={() => setTrackMethod("trackByCodeQR")}
            >
              By QR Code
            </button>
          </div>
        </div>

        <hr className="border-primary" />

        {/* Track by Product ID */}
        {trackMethod === "trackById" && (
          <>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="orderId">Order ID</label>
              <input
                type="number"
                name="orderId"
                placeholder="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="border border-gray-800 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 rounded-lg"
              />
            </div>
            <button
              onClick={handleTrackById}
              className="bg-green-700 w-full py-2 sm:py-3 rounded-lg text-gray-200 font-bold"
              disabled={loading}
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </>
        )}

        {/* Track by QR Code (unchanged) */}
        {trackMethod === "trackByCodeQR" && (
          <>
            <h1>Track by Code QR</h1>
            <button
              className="relative bg-green-700 w-full py-3 rounded-lg text-gray-200 font-bold"
              onClick={startScanning}
              disabled={isScannerActive}
            >
              Scan Code QR
            </button>
          </>
        )}

        {/* Display Order History */}
        {order && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl space-y-4 z-50 w-1/2">
            <h3 className="text-lg font-semibold text-center">Tracking Result</h3>

            {/* Product Name */}
            <h1>Product Name: {order.productName}</h1>

            {/* Current Stage */}
            <hr className="border-gray-500" />
            <h1>
              Current Stage: {order.isArrivedToDistributor ? "Arrived at Distributor" : order.isShippedToDistributor ? "Shipped to Distributor" : "Produced"}
            </h1>
            <h1>
              Date: {order.arrivedToDistributorAt !== "0" ? new Date(Number(order.arrivedToDistributorAt) * 1000).toLocaleString() : order.shippedToDistributorAt !== "0" ? new Date(Number(order.shippedToDistributorAt) * 1000).toLocaleString() : order.producedAt !== "0" ? new Date(Number(order.producedAt) * 1000).toLocaleString() : "N/A"}
            </h1>
            <hr className="border-gray-500" />

            {/* History */}
            <h1>Stage: Production</h1>
            <h1>{order.isProduced ? `Date: ${new Date(Number(order.producedAt) * 1000).toLocaleString()}` : "Not Produced Yet"}</h1>
            <hr className="border-gray-500" />

            <h1>Stage: Shipped to Distributor</h1>
            <h1>{order.isShippedToDistributor ? `Date: ${new Date(Number(order.shippedToDistributorAt) * 1000).toLocaleString()}` : "Not Shipped Yet"}</h1>
            <hr className="border-gray-500" />

            <h1>Stage: Arrived at Distributor</h1>
            <h1>{order.isArrivedToDistributor ? `Date: ${new Date(Number(order.arrivedToDistributorAt) * 1000).toLocaleString()}` : "Not Arrived Yet"}</h1>
            <hr className="border-gray-500" />

            {/* Confirm Delivery Button */}
            {order.orderStatus == "Arrived to Distributor" && (
              <button
                onClick={handleConfirmDelivery}
                className="bg-blue-600 w-full py-2 rounded-lg text-white font-bold hover:bg-blue-700 transition-colors"
                disabled={confirmLoading}
              >
                {confirmLoading ? "Confirming..." : "Confirm Delivery"}
              </button>
            )}

            <div className="flex w-full justify-center items-center">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Overlay with click handler */}
        {order && (
          <div
            className="fixed top-0 left-0 z-20 bg-black/90 w-full h-dvh"
            onClick={handleClose}
          />
        )}

        {/* Error Messages */}
        {(fetchError || confirmError) && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-xl text-red-600 z-50">
            {fetchError || confirmError}
          </div>
        )}

        {/* QR Code Elements (unchanged) */}
        {isScannerActive && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[80vw] max-w-[600px] text-center">
            <video ref={videoRef} className="w-full aspect-video rounded-lg shadow-xl bg-gray-900" />
            <button
              onClick={stopScanner}
              className="mt-5 px-5 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        )}
        {isScannerActive && <div className="fixed inset-0 bg-black/90 z-40" />}
        {error && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-xl text-red-600 z-50">
            {error}
          </div>
        )}
        {scanResult && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl space-y-4 z-50 w-11/12 sm:w-4/5 md:w-3/5 xl:w-1/3">
            <h3 className="text-lg font-semibold text-center">Result:</h3>
            <p className="break-words">{scanResult}</p>
            <div className="flex w-full justify-center items-center">
              <button
                onClick={() => setScanResult("")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {scanResult && <div className="fixed top-0 left-0 z-20 bg-black/90 w-full h-dvh" />}
      </div>
    </section>
  );
}