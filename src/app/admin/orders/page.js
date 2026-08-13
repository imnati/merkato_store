"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import api from "@/lib/axios";

export default function AdminOrdersLogistics() {
  const { activeRegion } = useAppEngine();
  const { t } = useTranslationEngine();
  const [activeOrdersList, setActiveOrdersList] = useState([]);

  const STATUS_LABELS = {
    "Pending Payment": t.stAwaitingPayment,
    Processing: t.stPaidProcessing,
    "In Transit": t.stInTransit,
    "Delivered Complete": t.stDelivered,
    "Cancelled / Refunded": t.stCancelled,
  };

  useEffect(() => {
    api.get("/orders")
      .then((res) => setActiveOrdersList(res.data))
      .catch(() => {});
  }, []);

  const handleToggleClearanceStatus = async (id, targetStatus) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status: targetStatus });
      setActiveOrdersList((prev) =>
        prev.map((o) => (o._id === id ? data : o))
      );
    } catch {
      alert(t.failedUpdateStatus);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Control Panel Heading Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono uppercase">
              {t.ordersTitle}
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              {t.ordersSub}
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-bold text-emerald-600 hover:underline font-mono bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
          >
            {t.backToDashboard}
          </Link>
        </div>

        {/* Multi-Region Consignments Ledger Data Spreadsheet Grid Table Component */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-xs font-medium min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                <th className="p-3">{t.hOrderId}</th>
                <th className="p-3">{t.hCustomer}</th>
                <th className="p-3">{t.hItems}</th>
                <th className="p-3 text-right">{t.hTotal}</th>
                <th className="p-3 text-center">{t.hStatus}</th>
                <th className="p-3 text-right">{t.hActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-slate-700">
              {activeOrdersList.map((order) => (
                <tr
                  key={order._id || order.id}
                  className="hover:bg-slate-50/40 transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {order._id || order.id}
                  </td>
                  <td className="p-3 font-semibold text-slate-500">
                    <p className="text-slate-900 font-extrabold">
                      {order.buyer || order.user?.name || t.customerAccount}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold font-mono mt-0.5 uppercase">
                      {t.deliverTo}:{" "}
                      {order.destination || order.zone || t.awaitingDetails}
                    </p>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">
                    <p className="line-clamp-1">
                      {Array.isArray(order.items) && order.items.length > 0
                        ? order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")
                        : order.summary || order.item || "—"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono italic">
                      {t.shippingLabel} {order.courier || "Regional air freight"}
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
                        order.status === "Pending Payment"
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : order.status === "Processing"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : order.status === "In Transit"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : order.status === "Cancelled / Refunded"
                                ? "bg-red-50 text-red-700 border-red-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap space-x-2">
                    {order.status !== "Delivered Complete" &&
                    order.status !== "Cancelled / Refunded" ? (
                      <>
                        <button
                          onClick={() =>
                            handleToggleClearanceStatus(order._id || order.id, "In Transit")
                          }
                          disabled={order.status === "In Transit"}
                          className={`text-[11px] font-bold border px-2.5 py-1 rounded-lg transition active:scale-95 ${
                            order.status === "In Transit"
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                          }`}
                        >
                          {t.approveShip}
                        </button>
                        <button
                          onClick={() =>
                            handleToggleClearanceStatus(
                              order._id || order.id,
                              "Delivered Complete",
                            )
                          }
                          className="text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-lg transition active:scale-95"
                        >
                          {t.markDelivered}
                        </button>
                        <button
                          onClick={() =>
                            handleToggleClearanceStatus(
                              order._id || order.id,
                              "Cancelled / Refunded",
                            )
                          }
                          className="text-red-500 hover:text-red-700 font-bold text-[11px] transition pl-1"
                        >
                          {t.cancel}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 font-mono tracking-tight italic text-[11px]">
                        {t.completed}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activeOrdersList.length === 0 && (
            <p className="text-xs text-gray-400 font-medium text-center py-8">
              {t.noOrders}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
