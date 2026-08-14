"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function SpecificationsDesk() {
  const { id } = useParams();
  const { products, addToCart, activeRegion } = useAppEngine();
  const { t } = useTranslationEngine();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  const product = products.find((p) => p.id === id || p._id === id) || products[0];

  const isOutOfStock = product?.status?.toLowerCase() === "out of stock";

  const fallbackImage =
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format";

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicNavbar />

      <main className="max-w-5xl mx-auto px-4 py-12 w-full sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start flex-grow">
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl aspect-square relative overflow-hidden shadow-sm">
            {!imgError && product?.images?.[galleryIdx] ? (
              <img
                src={product.images[galleryIdx]}
                alt={product?.name || "Product image"}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex items-center justify-center text-8xl text-gray-300">
                📦
              </div>
            )}

            <span
              className={`absolute top-4 right-4 text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase ${
                isOutOfStock
                  ? "bg-red-500 text-white"
                  : "bg-slate-900 text-white"
              }`}
            >
              {product?.status || "In Stock"}
            </span>
          </div>

          <div className="flex gap-2 justify-center">
            {product?.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setGalleryIdx(idx);
                  setImgError(false);
                }}
                className={`w-12 h-12 rounded-xl border transition-all overflow-hidden ${
                  galleryIdx === idx
                    ? "border-emerald-600 scale-105 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`${product?.name} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-black uppercase text-emerald-600 font-mono tracking-widest block">
            {product?.category || "General Marketplace"}
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {product?.name}
          </h1>

          <p className="text-xs text-gray-400 font-mono font-bold">
            SKU MAPPING INDEX: {product?.sku || "MK-GEN-000"} | Brand:{" "}
            {product?.brand || "Generic"}
          </p>

          <div className="text-2xl font-black text-slate-900 font-mono">
            {activeRegion?.symbol || "$"}
            {(product?.discountPrice ?? product?.price ?? 0).toFixed(2)}
          </div>

          <button
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
            className={`w-full text-xs font-black py-4 rounded-xl shadow transition-all active:scale-98 ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#0B1528] text-white hover:bg-slate-800"
            }`}
          >
            {isOutOfStock ? "Sold Out" : t?.btnCart || "Add to Cart"}
          </button>
        </div>
      </main>

      <DynamicFooter />
    </div>
  );
}
