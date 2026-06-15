"use client";

import React from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";

export default function AdminOrdersLogistics() {
  const { orderHistory, setOrderHistory, activeRegion } = useAppEngine();

  const activeOrdersList =
    orderHistory && orderHistory.length > 0
      ? orderHistory
      : [
          {
            id: "MK-ORD-884102",
            buyer: "Abebe Kebede",
            summary: "AcousticMax Pro ANC Headphones (x1)",
            total: 289.0,
            destination: "Ethiopia Hub Terminal",
            courier: "DHL Regional Express",
            status: "In Transit",
          },
          {
            id: "MK-ORD-710492",
            buyer: "Fatima Al-Maktoum",
            summary: "Organic Arabica Coffee (x2)",
            total: 59.0,
            destination: "UAE Gateway Node",
            courier: "Aramex Gulf Freight",
            status: "Processing",
          },
          {
            id: "MK-ORD-651204",
            buyer: "Chinedu Okafor",
            summary: "Classic Casual Denim Jacket (x1)",
            total: 120.0,
            destination: "Nigeria Logistics Center",
            courier: "FedEx West Africa",
            status: "In Transit",
          },
        ];

  // Operational status transition workflow modifiers updating global/local state
  const handleToggleClearanceStatus = (id, targetStatus) => {
    const updatedQueue = activeOrdersList.map((order) =>
      order.id === id ? { ...order, status: targetStatus } : order,
    );

    // Check if setOrderHistory handler is available in engine before committing mutation
    if (setOrderHistory) {
      setOrderHistory(updatedQueue);
    }

    alert(
      `🚚 Logistics Pipeline Updated: Order ${id} changed to "${targetStatus}".`,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Control Panel Heading Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono uppercase">
              Fulfillment Logistics Router
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Track shipping container dispatch vectors, calculate freight
              statuses, and execute regional routing clearance overrides.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-bold text-emerald-600 hover:underline font-mono bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
          >
            ← Operations Command Center
          </Link>
        </div>

        {/* Multi-Region Consignments Ledger Data Spreadsheet Grid Table Component */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-xs font-medium min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                <th className="p-3">Fulfillment ID Reference</th>
                <th className="p-3">Buyer Profile & Destination</th>
                <th className="p-3">Parcel Load Weights</th>
                <th className="p-3 text-right">Invoiced Settlement Net</th>
                <th className="p-3 text-center">Fulfillment State Pipeline</th>
                <th className="p-3 text-right">Logistics Adjustment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-slate-700">
              {activeOrdersList.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/40 transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {order.id}
                  </td>
                  <td className="p-3 font-semibold text-slate-500">
                    <p className="text-slate-900 font-extrabold">
                      {order.buyer || order.user?.name || "Customer Account"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold font-mono mt-0.5 uppercase">
                      Hub:{" "}
                      {order.destination ||
                        order.zone ||
                        "Pan-African Terminal"}
                    </p>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">
                    <p className="line-clamp-1">
                      {order.summary || order.item}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono italic">
                      Carrier: {order.courier || "Regional Air Freight"}
                    </p>
                  </td>
                  <td className="p-3 text-right font-mono font-black text-emerald-600">
                    {/* 🛠️ MODIFIED: ተለዋዋጭ የገንዘብ ምልክት እንዲጠቀም ተደረገ */}
                    {activeRegion?.symbol || "$"}
                    {(order.total || 0).toFixed(2)}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        order.status === "Processing"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : order.status === "In Transit"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : order.status === "Cancelled / Refunded"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap space-x-2">
                    {order.status !== "Delivered Complete" &&
                    order.status !== "Cancelled / Refunded" ? (
                      <>
                        <button
                          onClick={() =>
                            handleToggleClearanceStatus(order.id, "In Transit")
                          }
                          disabled={order.status === "In Transit"}
                          className={`text-[11px] font-bold border px-2.5 py-1 rounded-lg transition active:scale-95 ${
                            order.status === "In Transit"
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                          }`}
                        >
                          Dispatch Route
                        </button>
                        <button
                          onClick={() =>
                            handleToggleClearanceStatus(
                              order.id,
                              "Delivered Complete",
                            )
                          }
                          className="text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-lg transition active:scale-95"
                        >
                          Clear Handover
                        </button>
                        <button
                          onClick={() =>
                            handleToggleClearanceStatus(
                              order.id,
                              "Cancelled / Refunded",
                            )
                          }
                          className="text-red-500 hover:text-red-700 font-bold text-[11px] transition pl-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 font-mono tracking-tight italic text-[11px]">
                        Ledger Closed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
