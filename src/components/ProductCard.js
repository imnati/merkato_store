"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function ProductCard({ product, onAddToCart, symbol }) {
  const [imgIdx, setImgIdx] = useState(0);
  const { t } = useTranslationEngine();

  const { id, name, brand, price, discountPrice, sku, images, status } =
    product;

  const isOutOfStock = status?.toLowerCase() === "out of stock";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all group">
      <div className="bg-slate-50 rounded-xl aspect-square flex items-center justify-center text-5xl relative overflow-hidden">
        <span className="select-none">{images?.[imgIdx] || "📦"}</span>
        <span
          className={`absolute top-2 right-2 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase ${
            isOutOfStock ? "bg-red-500 text-white" : "bg-slate-900 text-white"
          }`}
        >
          {status || "In Stock"}
        </span>
      </div>

      <div className="flex justify-center gap-1 mt-2">
        {images?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setImgIdx(idx)}
            className={`w-3.5 h-3.5 rounded text-[8px] font-bold border transition-all ${
              imgIdx === idx
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="space-y-1 mt-3 flex-1">
        <p className="text-[9px] font-mono font-bold text-gray-400 uppercase">
          SKU: {sku || "MK-GEN-000"} | {brand || "Generic"}
        </p>
        <Link
          href={`/products/detail/${id}`}
          className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-emerald-600 transition-colors"
        >
          {name}
        </Link>
      </div>

      <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-slate-900 shrink-0">
          {symbol || "$"}
          {(discountPrice || price || 0).toFixed(2)}
        </span>

        <button
          onClick={() => !isOutOfStock && onAddToCart(product)}
          disabled={isOutOfStock}
          className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
          }`}
        >
          {isOutOfStock ? "Sold Out" : t.btnCart || "Add"}
        </button>
      </div>
    </div>
  );
}
