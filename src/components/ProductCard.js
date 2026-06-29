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
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Destructured all properties including new catalog features
  const {
    id,
    name,
    brand,
    price,
    discountPrice,
    sku,
    images,
    status,
    description,
    stockQuantity,
    rating,
    reviews,
  } = product;

  const isDiscountValid =
    showDiscount && typeof discountPrice === "number" && discountPrice < price;
  const isOutOfStock =
    stockQuantity <= 0 || status?.toLowerCase().includes("out");

  const getLocalizedName = () => {
    if (!mounted) return name;
    if (locale === "am" && product.nameAm) return product.nameAm;
    if (locale === "ar" && product.nameAr) return product.nameAr;
    return name;
  };

  const getLocalizedStatus = () => {
    if (isOutOfStock) return locale === "am" ? "ተሽጦ ያለቀ" : "Sold Out";
    return stockQuantity < 5
      ? locale === "am"
        ? "ሊያልቅ የቀረ"
        : "Low Stock"
      : locale === "am"
        ? "በክምችት ላይ"
        : "In Stock";
  };

  const displaySymbol = mounted
    ? locale === "am"
      ? "Br"
      : symbol || "$"
    : "$";

  // ✅ ማስተካከያ፡ በጋለሪው ውስጥ በአሁኑ ሰዓት የተመረጠውን ምስል ያነባል
  const currentImage = images?.[imgIdx] || "📦";

  // ✅ ማስተካከያ፡ የመጣው ዳታ ከኮምፒውተር ወይም ከድረ-ገጽ የመጣ እውነተኛ የምስል ሊንክ መሆኑን ያረጋግጣል [INDEX]
  const isRealImageFile =
    typeof currentImage === "string" &&
    (currentImage.startsWith("blob:") ||
      currentImage.startsWith("data:image") ||
      currentImage.startsWith("http") ||
      currentImage.startsWith("/"));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all group text-left">
      {/* Image Gallery & Status Badge */}
      <div className="bg-slate-50 rounded-xl aspect-square flex items-center justify-center text-5xl relative overflow-hidden">
        {/* ✅ ማስተካከያ፦ እውነተኛ የምስል ፋይል ከሆነ በ <img> ታግ፤ ምልክት (Emoji) ከሆነ ደግሞ በ <span> ያሳያል [INDEX] */}
        {isRealImageFile ? (
          <img
            src={currentImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
            onError={(e) => {
              e.target.style.display = "none";
            }} // ምስሉ መጫን ካልቻለ ስህተት እንዳያሳይ ይደብቀዋል
          />
        ) : (
          <span className="select-none group-hover:scale-105 transition-transform duration-200">
            {currentImage}
          </span>
        )}

        <span
          className={`absolute top-2 right-2 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase ${isOutOfStock ? "bg-red-500 text-white" : "bg-emerald-600 text-white"}`}
        >
          {getLocalizedStatus()}
        </span>
      </div>

      {/* Gallery Dots */}
      <div className="flex justify-center gap-1 mt-2">
        {images?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setImgIdx(idx)}
            className={`w-3.5 h-3.5 rounded text-[8px] font-bold border transition-all ${imgIdx === idx ? "bg-emerald-600 text-white" : "bg-white text-gray-400 border-gray-200"}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Info Section */}
      <div className="space-y-1.5 mt-3 flex-1 text-left">
        <div className="flex items-center gap-1 text-[9px]">
          <span className="text-yellow-500 font-bold">★ {rating || "0.0"}</span>
          <span className="text-gray-400">({reviews || 0} reviews)</span>
        </div>

        <p className="text-[9px] font-mono font-bold text-gray-400 uppercase">
          SKU: {sku || "N/A"} | {brand}
        </p>

        <Link
          href={`/products/detail/${id}`}
          className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-emerald-600 transition-colors block mt-1"
        >
          {getLocalizedName()}
        </Link>

        <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
          {description}
        </p>
      </div>

      {/* Pricing & Cart Action */}
      <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
        <div className="flex flex-col text-left">
          <span className="text-sm font-black text-slate-900 font-mono">
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
          className={`text-[10px] font-black px-3 py-2 rounded-lg transition-all ${isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"}`}
        >
          {isOutOfStock ? "Sold Out" : t?.btnCart || "Add"}
        </button>
      </div>
    </div>
  );
}
