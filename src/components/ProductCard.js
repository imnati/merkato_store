"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslationEngine } from "@/context/LanguageContext";
import { useAppEngine } from "@/context/AppContext";
import ProductImage from "@/components/ProductImage";

const HeartIcon = ({ filled }) =>
  filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .75-4.5 2-1.5-1.25-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .75-4.5 2-1.5-1.25-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );

const CartIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default function ProductCard({
  product,
  onAddToCart,
  showDiscount = false,
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const { locale, t } = useTranslationEngine();
  const { wishlistIds, toggleWishlist, formatPrice } = useAppEngine();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const { id, _id, name, brand, price, discountPrice, sku, images, status } = product;
  const productId = _id || id;

  const hasDiscount =
    typeof discountPrice === "number" && discountPrice < price;
  const isDiscountValid = showDiscount && hasDiscount;
  const displayPrice = hasDiscount ? discountPrice : price;

  const cleanStatus = status?.toLowerCase() || "";
  const isOutOfStock =
    cleanStatus === "out of stock" || cleanStatus === "ተሽጦ ያለቀ";
  const isLowStock = cleanStatus === "low stock" || cleanStatus === "ሊያልቅ የቀረ";

  const getLocalizedName = () => {
    if (!mounted) return name;
    if (locale === "am" && product.nameAm) return product.nameAm;
    if (locale === "ar" && product.nameAr) return product.nameAr;
    return name;
  };

  const getLocalizedStatus = () => {
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

  const statusTone = isOutOfStock
    ? "bg-red-500"
    : isLowStock
      ? "bg-amber-500"
      : "bg-emerald-600";

  const isWishlisted = wishlistIds.includes(String(productId));

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-slate-100 rounded-2xl p-3.5 transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1">
      {/* Media */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <ProductImage
          src={images?.[imgIdx] || "📦"}
          alt={name}
          emojiClassName="text-5xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
        />

        {/* Status badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-[9px] font-black tracking-wider px-2 py-1 rounded-full uppercase text-white shadow-sm ${statusTone}`}
        >
          {getLocalizedStatus()}
        </span>

        {/* Wishlist toggle */}
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={() => toggleWishlist(productId)}
          className={`absolute top-2.5 left-2.5 grid h-7 w-7 place-items-center rounded-full border shadow-sm transition-all active:scale-90 ${
            isWishlisted
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white/90 hover:bg-white border-slate-100 text-slate-400 hover:text-red-500"
          }`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* Discount pill */}
        {isDiscountValid && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 uppercase shadow-sm">
            -{Math.round(((price - discountPrice) / price) * 100)}%
          </span>
        )}
      </div>

      {/* Thumbnail selector */}
      {images?.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setImgIdx(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                imgIdx === idx ? "w-4 bg-emerald-600" : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Body */}
      <div className="mt-3 flex-1 space-y-1">
        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
          <span className="text-emerald-600">{brand || "Generic"}</span>
          <span className="mx-1 text-slate-300">·</span>
          {sku || "MK-GEN-000"}
        </p>
        <Link
          href={`/products/detail/${productId}`}
          className="block text-xs font-bold text-slate-800 leading-snug line-clamp-2 hover:text-emerald-700 transition-colors"
        >
          {getLocalizedName()}
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="block text-sm font-black text-slate-900 font-mono truncate">
            {formatPrice(displayPrice)}
          </span>
          {isDiscountValid ? (
            <span className="block text-[10px] text-slate-400 line-through font-mono">
              {formatPrice(price)}
            </span>
          ) : (
            isLowStock && (
              <span className="block text-[10px] text-amber-600 font-bold">
                Only a few left
              </span>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => !isOutOfStock && onAddToCart(product)}
          disabled={isOutOfStock}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
            isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-emerald-700/30"
          }`}
        >
          {CartIcon}
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}