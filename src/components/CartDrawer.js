"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateCartQty, removeFromCart, activeRegion } = useAppEngine();
  const { t } = useTranslationEngine();

  const totalCost = (cart || []).reduce(
    (sum, item) => sum + (item.activePrice ?? item.price ?? 0) * item.quantity,
    0,
  );

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider font-mono">
                  🛒 {t.basketTitle || "Basket"}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <span className="text-3xl block">📥</span>
                    <p className="text-xs font-semibold text-gray-400">
                      Basket is empty.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"
                    >
                      <div className="bg-white w-10 h-10 rounded-lg border border-gray-100 shrink-0 overflow-hidden">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center text-xl text-gray-300 w-full h-full">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {activeRegion?.symbol || "$"}
                          {(
                            (item.activePrice ?? item.price ?? 0) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(item.id);
                            } else {
                              updateCartQty(item.id, item.quantity - 1);
                            }
                          }}
                          className="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded-md font-bold text-slate-700 transition-colors flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-bold font-mono text-slate-800 text-xs min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded-md font-bold text-slate-700 transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full text-center block bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-3.5 rounded-xl uppercase tracking-wider font-mono shadow transition-all active:scale-[0.99]"
                  >
                    View Cart
                  </Link>
                  <div className="flex items-baseline justify-between text-xs font-black text-slate-900">
                    <span>{t.totalEst || "Total"}:</span>
                    <span className="text-emerald-600 font-mono text-sm">
                      {activeRegion?.symbol || "$"}
                      {totalCost.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full text-center block bg-orange-600 hover:bg-orange-700 text-white text-xs font-black py-3.5 rounded-xl uppercase tracking-wider font-mono shadow transition-all active:scale-[0.99]"
                  >
                    {t.checkoutBtn || "Proceed to Checkout"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
