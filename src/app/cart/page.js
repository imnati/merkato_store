"use client";
import React from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";

export default function StandaloneCartPage() {
  const { cart, updateCartQty, removeFromCart, activeRegion } = useAppEngine();

  const subtotalValue = (cart || []).reduce(
    (acc, item) => acc + (item.activePrice || item.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-slate-800 space-y-6 animate-fade-in">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-black font-mono tracking-tight uppercase">
          Shopping Bag Registry
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Review selected catalog items, modify line quantities, and manage item
          row purges.
        </p>
      </div>

      {!cart || cart.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center text-gray-400 font-medium shadow-sm space-y-3">
          <span className="text-4xl block">📥</span>
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            Your shopping cart inventory queue matches zero entries.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0B1528] hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow"
          >
            Return to Storefront Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 divide-y divide-gray-50 shadow-sm">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 text-xs font-semibold"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl bg-slate-50 border border-gray-50 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner select-none">
                    {item.images?.[0] || "📦"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-slate-900 font-bold truncate text-sm">
                      {item.name}
                    </p>
                    <p className="text-gray-400 font-mono font-bold text-[10px] uppercase mt-0.5">
                      SKU Reference: {item.sku || "MK-GEN-000"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity <= 1) {
                          removeFromCart(item.id);
                        } else {
                          updateCartQty(item.id, item.quantity - 1);
                        }
                      }}
                      className="px-2.5 py-1 text-gray-400 hover:text-slate-900 hover:bg-gray-50 font-bold font-mono text-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="px-1 font-bold font-mono text-slate-800 w-6 text-center text-xs">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-400 hover:text-slate-900 hover:bg-gray-50 font-bold font-mono text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-black text-slate-900 font-mono w-24 text-right text-sm">
                    {activeRegion?.symbol || "د.إ"}{" "}
                    {(
                      (item.activePrice || item.price || 0) * item.quantity
                    ).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 font-bold pl-1 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs font-semibold text-gray-500 text-center sm:text-left">
              <span>Gross Balance Subtotal Value:</span>
              <span className="text-slate-900 font-black font-mono text-xl block mt-0.5">
                {activeRegion?.symbol || "د.إ"} {subtotalValue.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-black text-center text-xs py-4 px-8 rounded-xl uppercase tracking-wider font-mono shadow transition-all active:scale-[0.98]"
            >
              Proceed to Checkout Pipeline
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
