"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";

function CartPageContent() {
  const { cart, updateCartQty, removeFromCart, activeRegion, clearCart } =
    useAppEngine();
  const { t } = useTranslationEngine();

  const totalCost = (cart || []).reduce(
    (sum, item) => sum + (item.activePrice ?? item.price ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicNavbar />

      <main className="max-w-5xl mx-auto px-4 py-12 w-full sm:px-6 lg:px-8 flex-grow">
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight uppercase">
            Shopping Basket
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Review your selected items before proceeding to checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <span className="text-5xl block">🛒</span>
            <p className="text-sm font-semibold text-gray-400">
              Your basket is empty.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black py-3.5 px-6 rounded-xl uppercase tracking-wider transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id || item.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="bg-slate-50 w-16 h-16 rounded-xl border border-gray-100 shrink-0 overflow-hidden">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-3xl text-gray-300 w-full h-full">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono font-bold mt-0.5">
                      SKU: {item.sku || "MK-GEN-000"} | {item.brand || "Generic"}
                    </p>
                    <p className="text-sm font-black text-slate-900 font-mono mt-1">
                      {activeRegion?.symbol || "$"}
                      {(
                        (item.activePrice ?? item.price ?? 0) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeFromCart(item.id);
                          } else {
                            updateCartQty(item.id, item.quantity - 1);
                          }
                        }}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-black text-slate-700 transition-colors mobile-touch-optimal"
                      >
                        -
                      </button>
                      <span className="font-bold font-mono text-slate-800 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQty(item.id, item.quantity + 1)
                        }
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-black text-slate-700 transition-colors mobile-touch-optimal"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 font-bold text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 lg:sticky lg:top-28">
              <h3 className="text-xs font-black uppercase text-slate-800 border-b pb-2 tracking-wider font-mono">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs font-medium text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {activeRegion?.symbol || "$"}
                    {totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 bg-slate-50/80 p-3 rounded-xl flex items-baseline justify-between text-xs font-black text-slate-900">
                <span>Estimated Total</span>
                <span className="text-emerald-600 font-mono text-sm font-black">
                  {activeRegion?.symbol || "$"}
                  {totalCost.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full text-center block bg-orange-600 hover:bg-orange-700 text-white text-xs font-black py-3.5 rounded-xl uppercase tracking-wider font-mono shadow transition-all active:scale-[0.99]"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </main>

      <DynamicFooter />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-12 w-full sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CartPageContent />
    </Suspense>
  );
}
