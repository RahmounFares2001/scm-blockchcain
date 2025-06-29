"use client";

import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { IoHomeOutline } from "react-icons/io5";
import { RiArrowGoBackLine } from "react-icons/ri";
import Link from "next/link";
import useGetOrderDetailsByClientOrderId from "../hooks/orders/useGetOrderDetailsByClientOrderId";
import useClientConfirmDelivery from "../hooks/orders/useClientConfirmDelivery";
import useGetManufacturerByAddress from "../hooks/manufacturers/useGetManufacturerByAddress";
import useFetchDistributorByAddress from "../hooks/distributors/useFetchDistributorByAddress";

export default function TrackPage() {
  const [trackMethod, setTrackMethod] = useState("");
  const [orderId, setOrderId] = useState("");
  const { orderDetails, loading, error: fetchError, fetchOrder, reset } = useGetOrderDetailsByClientOrderId();
  const { clientConfirmDelivery, loading: confirmLoading, error: confirmError, success } = useClientConfirmDelivery();

  // QR Code
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (isScannerActive && videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            const qrData = JSON.parse(result.data);
            if (!qrData.clientOrderId) {
              throw new Error("Missing clientOrderId in QR code");
            }
            console.log("Scanned QR Code:", {
              productHash: qrData.productHash,
              clientOrderId: qrData.clientOrderId,
            });
            fetchOrder(qrData.clientOrderId.toString());
            stopScanner();
          } catch (err) {
            console.error("Error parsing QR code data:", err);
            setError("Invalid QR code format or missing clientOrderId.");
            stopScanner();
          }
        },
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

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
  }, [isScannerActive, fetchOrder]);

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScannerActive(false);
  };

  const startScanning = () => {
    setError("");
    setIsScannerActive(true);
  };

  // Handle tracking by ID
  const { manufacturer, loadingManufacturer, errorManufacturer, fetchManufacturer } = useGetManufacturerByAddress();
  const { fetchDistributorByAddress, distributor, loading: loadingDistributor, error: errorDistributor } = useFetchDistributorByAddress();
  const handleTrackById = () => {
    if (orderId && !orderDetails) {
      fetchOrder(orderId.toString());
    }
  };

  useEffect(() => {
    if (orderDetails) {
      const manufacturerAdd = orderDetails?.order.manufacturerAddress;
      const distributorAdd = orderDetails?.order.distributorAddress;
      if (manufacturerAdd) fetchManufacturer(manufacturerAdd);
      if (distributorAdd) fetchDistributorByAddress(distributorAdd);
    }
  }, [orderDetails]);

  // Close handler for both button and overlay
  const handleClose = () => {
    setOrderId("");
    reset();
  };

  // Confirm delivery handler
  const handleConfirmDelivery = () => {
    var id = orderDetails.clientOrder.id;
    clientConfirmDelivery(Number(id)).then(() => {
      fetchOrder(Number(id)); // Refresh order state after confirmation
    });
  };


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

        {/* Track by QR Code */}
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
        {orderDetails && (
          <div className="text-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl space-y-4 z-50 w-1/2 h-5/6 overflow-auto">
            <div className="overflow-auto flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-center">Tracking Result</h3>

              {/* Product Name */}
              <h1><span className="font-bold">Product Name: </span>{orderDetails.order.productName}</h1>
              <h1><span className="font-bold">Order quantity: </span>{orderDetails.clientOrder.clientProductQuantity}</h1>
              <h1><span className="font-bold">Product Hash</span>: <span className="text-xs break-words">{orderDetails.order.productHash}</span></h1>
              <hr className="border-gray-500" />

              <h1><span className="font-bold">Manufacturer name: </span>{manufacturer?.name || (loadingManufacturer ? "Loading..." : "N/A")}</h1>
              <h1><span className="font-bold">Manufacturing place: </span>{manufacturer?.place || (loadingManufacturer ? "Loading..." : "N/A")}</h1>
              <hr className="border-gray-500" />

              <h1><span className="font-bold">Distributor name: </span>{distributor?.name || (loadingDistributor ? "Loading..." : "N/A")}</h1>
              <h1><span className="font-bold">Distributor place: </span>{distributor?.place || (loadingDistributor ? "Loading..." : "N/A")}</h1>

              {/* Current Stage */}
              <hr className="border-gray-500" />
              <h1 className="font-bold">
                Current Stage: {orderDetails.clientOrder.isArrivedToClient ? "Arrived at Client" : orderDetails.clientOrder.isShippedToClient ? "Shipped to Client" : orderDetails.order.isArrivedToDistributor ? "Arrived to Distributor" : orderDetails.order.isShippedToDistributor ? "Shipped to Distributor" : orderDetails.order.isProduced ? "Production" : "Pending Production"}
              </h1>
              <hr className="border-gray-500" />

              {/* History */}
              <div className="flex items-center">
                <h1 className="pr-7 font-bold text-xl">01</h1>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold">Stage: Production</h1>
                  <h1>{orderDetails.order.isProduced ? `Date: ${new Date(Number(orderDetails.order.producedAt) * 1000).toLocaleString()}` : "Not Produced Yet"}</h1>
                </div>
              </div>
              <hr className="border-gray-500" />

              <div className="flex items-center">
                <h1 className="pr-7 font-bold text-xl">02</h1>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold">Stage: Shipped to Distributor</h1>
                  <h1>{orderDetails.order.isShippedToDistributor ? `Date: ${new Date(Number(orderDetails.order.shippedToDistributorAt) * 1000).toLocaleString()}` : "Not Shipped Yet"}</h1>
                </div>
              </div>
              <hr className="border-gray-500" />

              <div className="flex items-center">
                <h1 className="pr-7 font-bold text-xl">03</h1>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold">Stage: Arrived at Distributor</h1>
                  <h1>{orderDetails.order.isArrivedToDistributor ? `Date: ${new Date(Number(orderDetails.order.arrivedToDistributorAt) * 1000).toLocaleString()}` : "Not Arrived Yet"}</h1>
                </div>
              </div>
              <hr className="border-gray-500" />

              <div className="flex items-center">
                <h1 className="pr-7 font-bold text-xl">04</h1>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold">Stage: Shipped to Client</h1>
                  <h1>{orderDetails.clientOrder.isShippedToClient ? `Date: ${new Date(Number(orderDetails.clientOrder.shippedToClientAt) * 1000).toLocaleString()}` : "Not Shipped Yet"}</h1>
                </div>
              </div>
              <hr className="border-gray-500" />

              <div className="flex items-center">
                <h1 className="pr-7 font-bold text-xl">05</h1>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold">Stage: Delivered to Client</h1>
                  <h1>{orderDetails.clientOrder.isArrivedToClient ? `Date: ${new Date(Number(orderDetails.clientOrder.deliveredToClientAt) * 1000).toLocaleString()}` : "Not Delivered Yet"}</h1>
                </div>
              </div>
              <hr className="border-gray-500" />

              {/* Confirm Delivery Button */}
              {!orderDetails.clientOrder.isArrivedToClient && (
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
          </div>
        )}

        {/* Overlay with click handler */}
        {orderDetails && (
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

        {/* QR Code Scanner */}
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
      </div>
    </section>
  );
}