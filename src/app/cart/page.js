"use client";
import React from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import ProductImage from "@/components/ProductImage";
import { CloseIcon, InboxIcon } from "@/components/Icons";

export default function StandaloneCartPage() {
  const { t } = useTranslationEngine();
  const { cart, updateCartQty, removeFromCart, formatPrice } = useAppEngine();

  const subtotalValue = (cart || []).reduce(
    (acc, item) => acc + (item.activePrice || item.price || 0) * item.quantity,
    0,
  );

  const subtotalLocal = formatPrice(subtotalValue);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-slate-800 space-y-6 animate-fade-in">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-black font-mono tracking-tight uppercase">
          {t.cartTitle}
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          {t.cartSubtitle}
        </p>
      </div>

      {!cart || cart.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center text-gray-400 font-medium shadow-sm space-y-3">
          <span className="block mx-auto text-gray-300">
            <InboxIcon className="h-10 w-10" />
          </span>
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            {t.cartEmpty}
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0B1528] hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow"
          >
            {t.returnToStore}
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
                  <span className="bg-slate-50 border border-gray-50 w-12 h-12 rounded-xl shadow-inner relative overflow-hidden">
                    <ProductImage
                      src={item.images?.[0] || "📦"}
                      alt={item.name}
                      emojiClassName="text-3xl"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-slate-900 font-bold truncate text-sm">
                      {item.name}
                    </p>
                    <p className="text-gray-400 font-mono font-bold text-[10px] uppercase mt-0.5">
                      {t.skuLabel} {item.sku || "MK-GEN-000"}
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
                    {formatPrice(
                      (item.activePrice || item.price || 0) * item.quantity,
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 font-bold pl-1 transition text-sm"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs font-semibold text-gray-500 text-center sm:text-left">
              <span>{t.subtotal}</span>
              <span className="text-slate-900 font-black font-mono text-xl block mt-0.5">
                {subtotalLocal}
              </span>
              <p className="text-[10px] text-gray-400 font-medium mt-1">
                {t.freightNote}
              </p>
            </div>
            <Link
              href="/checkout"
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-black text-center text-xs py-4 px-8 rounded-xl uppercase tracking-wider font-mono shadow transition-all active:scale-[0.98]"
            >
              {t.checkoutBtn}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
