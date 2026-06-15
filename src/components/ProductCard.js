"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function ProductCard({
  product,
  onAddToCart,
  symbol,
  showDiscount = false,
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const { locale, t } = useTranslationEngine();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const { id, name, brand, price, discountPrice, sku, images, status } =
    product;

  // The logic now checks showDiscount prop AND validity
  const isDiscountValid =
    showDiscount && typeof discountPrice === "number" && discountPrice < price;

  const isOutOfStock =
    status?.toLowerCase() === "out of stock" ||
    status?.toLowerCase() === "ተሽጦ ያለቀ";

  const getLocalizedName = () => {
    if (!mounted) return name;
    if (locale === "am" && product.nameAm) return product.nameAm;
    if (locale === "ar" && product.nameAr) return product.nameAr;
    return name;
  };

  const getLocalizedStatus = () => {
    const cleanStatus = status?.toLowerCase() || "";
    if (!mounted) return status || "In Stock";

    if (locale === "am") {
      if (cleanStatus === "in stock") return "በክምችት ላይ ያለ";
      if (cleanStatus === "low stock") return "ሊያልቅ የቀረ";
      return "ተሽጦ ያለቀ";
    }
    if (locale === "ar") {
      if (cleanStatus === "in stock") return "متوفر";
      if (cleanStatus === "low stock") return "كمية محدودة";
      return "نفذت الكمية";
    }
    return status || "In Stock";
  };

  const getButtonText = () => {
    if (isOutOfStock) {
      if (locale === "am") return "ተሽጦ ያለቀ";
      if (locale === "ar") return "نفذت";
      return "Sold Out";
    }
    return t?.btnCart || "Add";
  };

  const displaySymbol = mounted
    ? locale === "am"
      ? "Br"
      : symbol || "$"
    : "$";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all group">
      <div className="bg-slate-50 rounded-xl aspect-square flex items-center justify-center text-5xl relative overflow-hidden">
        <span className="select-none">{images?.[imgIdx] || "📦"}</span>
        <span
          className={`absolute top-2 right-2 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase ${
            isOutOfStock ? "bg-red-500 text-white" : "bg-slate-900 text-white"
          }`}
        >
          {getLocalizedStatus()}
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
          {getLocalizedName()}
        </Link>
      </div>

      <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 shrink-0 font-mono">
            {displaySymbol}
            {isDiscountValid ? discountPrice.toFixed(2) : price.toFixed(2)}
          </span>

          {isDiscountValid && (
            <span className="text-[10px] text-gray-400 line-through font-mono">
              {displaySymbol}
              {price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => !isOutOfStock && onAddToCart(product)}
          disabled={isOutOfStock}
          className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
          }`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
