"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import api from "@/lib/axios";

export default function AdminBICommandCenter() {
  const { t } = useTranslationEngine();
  const [timeframe, setTimeframe] = useState("24h");
  const { products } = useAppEngine();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const STATUS_LABELS = {
    "Pending Payment": t.stAwaitingPayment,
    Processing: t.stPaidProcessing,
    "In Transit": t.stInTransit,
    "Delivered Complete": t.stDelivered,
    "Cancelled / Refunded": t.stCancelled,
  };

  useEffect(() => {
    const loadTelemetry = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadTelemetry();
  }, []);

  const settledOrders = orders.filter((o) => o.status !== "Cancelled / Refunded");
  const totalRevenueUSD = settledOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status || "Pending Payment"] = (acc[o.status || "Pending Payment"] || 0) + 1;
    return acc;
  }, {});
  const lowStockItems = (products || []).filter(
    (p) => (p.stockQuantity ?? p.stock ?? 0) <= 5,
  ).length;
  const catalogVolume = (products || []).length;
  const activeOrders = orders.filter(
    (o) => !["Delivered Complete", "Cancelled / Refunded"].includes(o.status),
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono uppercase">
            {t.adminDashboard}
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            {t.adminOverview}
          </p>
        </div>

<div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-emerald-600 hover:underline font-mono bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
            >
              {t.backToStore}
            </Link>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-gray-100 border border-gray-200 text-xs font-bold rounded-xl p-2.5 text-gray-700 focus:outline-none cursor-pointer"
            >
          <option value="24h">{t.last24h}</option>
          <option value="7d">{t.last7d}</option>
          <option value="30d">{t.last30d}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            {t.totalRevenue}
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            USD ${totalRevenueUSD.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-mono">
            {settledOrders.length} {t.paidOrders}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            {t.activeOrders}
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {activeOrders}
          </p>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-mono">
            {orders.length} {t.totalShort}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            {t.lowStock}
          </span>
          <p className="text-2xl font-black text-amber-600 font-mono">
            {lowStockItems} {t.items}
          </p>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold font-mono">
            {loading ? t.loadingProducts : t.needsReplenishment}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            {t.productsTitle}
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {catalogVolume}
          </p>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold font-mono">
            {t.inCatalog}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-black uppercase text-slate-800 font-mono border-b border-gray-50 pb-2">
            {t.statusDistribution}
          </h3>
          {loading ? (
            <p className="text-xs text-gray-400 font-medium">
              {t.loadingRecentOrders}
            </p>
          ) : (
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between text-xs font-bold"
                >
                  <span className="text-slate-600">{STATUS_LABELS[status] || status}</span>
                  <span className="font-mono font-black text-slate-900">
                    {count}
                  </span>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-xs text-gray-400 font-medium">
                  {t.noOrders}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
          <span className="text-xs font-extrabold font-mono uppercase text-gray-400">
            {t.quickActions}
          </span>
          <div className="flex gap-2 text-[11px] font-bold font-mono">
            <Link
              href="/admin/products"
              className="bg-[#0B1528] hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow-sm transition"
            >
              {t.manageProducts}
            </Link>
            <Link
              href="/admin/orders"
              className="bg-[#0B1528] hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow-sm transition"
            >
              {t.manageOrders}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-50 pb-2">
          <h3 className="text-sm font-black uppercase text-slate-800 font-mono">
            {t.recentOrders}
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            {t.recentOrdersSub}
          </p>
        </div>

        <div className="space-y-3">
          {loading && (
            <p className="text-xs text-gray-400 font-medium">
              {t.loadingRecentOrders}
            </p>
          )}
          {orders.slice(-6).reverse().map((order) => (
            <div
              key={order._id}
              className="text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between border border-slate-50 bg-slate-50/50 p-4 rounded-xl gap-2 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-900 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    {order._id}
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase tracking-wide">
                    {STATUS_LABELS[order.status] || order.status || "Pending Payment"}
                  </span>
                </div>
                <p className="text-gray-500 font-medium text-[11px]">
                  {order.items?.length || 0} {t.items} • $
                  {(order.total || 0).toLocaleString()} •{" "}
                  {order.destination || t.destinationPending}
                </p>
              </div>
              <span className="text-gray-400 font-mono font-normal text-[10px] whitespace-nowrap text-right">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
          {!loading && orders.length === 0 && (
            <p className="text-xs text-gray-400 font-medium">
              {t.noOrders}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
