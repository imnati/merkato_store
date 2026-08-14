"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function ProductCard({ product, onAddToCart, symbol, onToggleWishlist, isWishlisted }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const { t } = useTranslationEngine();

  const { id, name, brand, price, discountPrice, sku, images, status } =
    product;

  const safeId = id || product._id;

  const isOutOfStock = status?.toLowerCase() === "out of stock";

  const fallbackImage =
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all group relative">
      <div className="bg-slate-50 rounded-xl aspect-square relative overflow-hidden">
        {!imgError && images?.[imgIdx] ? (
          <img
            src={images[imgIdx]}
            alt={name || "Product image"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center text-5xl text-gray-300">
            📦
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase ${
            isOutOfStock ? "bg-red-500 text-white" : "bg-slate-900 text-white"
          }`}
        >
          {status || "In Stock"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-sm font-bold shadow-sm hover:scale-110 transition-all"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-2">
        {images?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setImgIdx(idx);
              setImgError(false);
            }}
            className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all mobile-touch-optimal ${
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
          href={`/products/detail/${safeId}`}
          className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-emerald-600 transition-colors"
        >
          {name}
        </Link>
      </div>

      <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-slate-900 shrink-0">
          {symbol || "$"}
          {(product.discountPrice ?? product.price ?? 0).toFixed(2)}
        </span>

        <button
          onClick={() => !isOutOfStock && onAddToCart(product)}
          disabled={isOutOfStock}
          className={`text-[10px] font-black px-3 py-2.5 rounded-lg transition-all mobile-touch-optimal ${
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
