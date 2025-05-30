"use client";

import React, { useState } from "react";
import ConfirmReception from "./ConfirmReception";
import ReportProblem from "./ReportProblem"; // Import the new component

export default function Action({ data, onClose }) {



  const [action, setAction] = useState("");

  return (
    <>
      {action === "" ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full z-50 h-5/6 overflow-auto">
          {/* Buttons Section */}
          <div className="flex justify-end gap-5">
            <button
              onClick={() => setAction("confirm")}
              className="w-1/2 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Confirm Reception
            </button>
            <button
              onClick={() => setAction("report")}
              className="w-1/2 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600"
            >
              Report Problem
            </button>
          </div>
        </div>
      ) : action === "confirm" ? (
        <ConfirmReception data={data} onClose={onClose} />
      ) : action === "report" ? (
        <ReportProblem data={data} onClose={onClose} />
      ) : null}
    </>
  );
}