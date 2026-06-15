"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AdminBICommandCenter() {
  const [timeframe, setTimeframe] = useState("24h");

  const BI_TELEMETRY = {
    totalRevenueUSD: 142450.0,
    dailySalesCount: 342,
    activeHourlySessions: 2450,
    conversionRatio: 3.4,
  };

  const CUSTOMER_ACTIVITY_STREAM = [
    {
      id: "act-1",
      timestamp: "15:42",
      name: "Solomom",
      code: "AE",
      label: "Completed Checkout",
      details: "Cleared order ref MK-710492 (Value: AED 145.00)",
    },
    {
      id: "act-2",
      timestamp: "15:35",
      name: "Abebe ",
      code: "ET",
      label: "Submitted Review",
      details: "Assigned 5-star rating matrix index to wireless headphones",
    },
    {
      id: "act-3",
      timestamp: "15:14",
      name: "Yisak",
      code: "NG",
      label: "Profile Registration",
      details: "Provisioned new customer secure profile parameters array",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono uppercase">
            BI Command Center
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Real-time system business intelligence reporting metrics across
            regional hubs operations.
          </p>
        </div>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-100 border border-gray-200 text-xs font-bold rounded-xl p-2.5 text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="24h">Sync: Last 24 Hours</option>
          <option value="7d">Sync: Last 7 Days</option>
          <option value="30d">Sync: Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            Total Gross Revenue
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            USD ${BI_TELEMETRY.totalRevenueUSD.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-mono">
            +14.2% MoM
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            Daily Sales Volume
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {BI_TELEMETRY.dailySalesCount} Units
          </p>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-mono">
            +8.5% Daily
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            Concurrent Sockets
          </span>
          <p className="text-2xl font-black text-emerald-600 font-mono animate-pulse">
            {BI_TELEMETRY.activeHourlySessions} Active
          </p>
          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold font-mono">
            Live Stream
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider block">
            Conversion Efficiency
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {BI_TELEMETRY.conversionRatio}% Rate
          </p>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold font-mono">
            SLA Optimal
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <span className="text-xs font-extrabold font-mono uppercase text-gray-400">
          Logistical Control Sub-Desks:
        </span>
        <div className="flex gap-2 text-[11px] font-bold font-mono">
          <Link
            href="/admin/products"
            className="bg-[#0B1528] hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow-sm transition"
          >
            📁 Products Catalog CRUD
          </Link>
          <Link
            href="/admin/orders"
            className="bg-[#0B1528] hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow-sm transition"
          >
            🚚 Logistics Package Router
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-50 pb-2">
          <h3 className="text-sm font-black uppercase text-slate-800 font-mono">
            ⏱️ Live Customer Activity Telemetry Logs
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Real-time trail capture monitoring client checkouts and state
            mutations cross-border.
          </p>
        </div>

        <div className="space-y-3">
          {CUSTOMER_ACTIVITY_STREAM.map((log) => (
            <div
              key={log.id}
              className="text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between border border-slate-50 bg-slate-50/50 p-4 rounded-xl gap-2 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-900 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    {log.code}
                  </span>
                  <span className="text-slate-900 font-extrabold">
                    {log.name}
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase tracking-wide">
                    {log.label}
                  </span>
                </div>
                <p className="text-gray-500 font-medium text-[11px]">
                  {log.details}
                </p>
              </div>
              <span className="text-gray-400 font-mono font-normal text-[10px] whitespace-nowrap text-right">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
