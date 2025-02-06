"use client";

import React, { useEffect, useRef, useState } from 'react'

// scan
import QrScanner from 'qr-scanner';

import { BrowserMultiFormatReader } from '@zxing/library';

export default function page() {
    const [isScannerActive, setIsScannerActive] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [error, setError] = useState('');
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
  
    useEffect(() => {
      if (isScannerActive && videoRef.current) {
        qrScannerRef.current = new QrScanner(videoRef.current, result => {
          setScanResult(result);
          stopScanner();
        }, {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
        });
  
        qrScannerRef.current.start()
          .catch(err => {
            setError('Camera access denied or no camera found');
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
      setScanResult('');
      setError('');
      setIsScannerActive(true);
    };
  
  return (
    <section className='w-full h-dvh flex justify-center items-center bg-primary' >

        <div className='w-3/5 h-[550px] bg-white flex flex-col gap-5 px-10 py-8
                rounded-lg shadow-lg shadow-gray-500' >
            <h1 className='text-center font-bold text-gray-900' >Track & Confirm Reception of your product</h1>
            <hr className='border-primary' />

            <div className='flex flex-col gap-5' >
                <h1>Chose method of tracking</h1>
                <div className='flex gap-10 w-full text-gray-200  items-center'>
                    <button className='bg-primary px-6 py-2 w-1/2 rounded-lg
                            hover:bg-primary/90' >By ID</button>
                    <button className='bg-primary px-6 py-2 w-1/2 rounded-lg' >By QR Code</button>
                </div>
            </div>

            <hr className='border-primary' />


            {/* track by product Id */}
            <div className='w-full flex flex-col gap-2' >
                <label htmlFor="productId">Product Id</label>
                <input type="number" name='productId'
                    placeholder='productId'
                    className='border border-gray-800
                    px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                    rounded-lg' />
            </div>

            <button className='bg-green-700 w-full py-3 rounded-lg text-gray-200
                    font-bold'  >Track</button>


            {/* track by code qr */}
            <h1>Track by Code QR</h1>
            <button className='relative bg-green-700 w-full py-3 rounded-lg text-gray-200
                    font-bold'
                    onClick={startScanning} disabled={isScannerActive} >
                Scan Code QR  
            </button>
            
             {/* Camera Preview */}
      {isScannerActive && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[80vw] max-w-[600px] text-center">
          <video
            ref={videoRef}
            className="w-full aspect-video rounded-lg shadow-xl bg-gray-900"
          />
          <button
            onClick={stopScanner}
            className="mt-5 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Stop Scanning
          </button>
        </div>
      )}

      {/* Overlay */}
      {isScannerActive && (
        <div className="fixed inset-0 bg-black/90 z-40" />
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-xl text-red-600 z-50">
          {error}
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl space-y-4 text-center z-50">
          <h3 className="text-lg font-semibold">Scanned Result:</h3>
          <p className="break-words">{scanResult}</p>
          <button
            onClick={() => setScanResult('')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      )}
        

        </div>

    </section>
  )
}
