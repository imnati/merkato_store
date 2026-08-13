"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import api from "@/lib/axios";
import ProductImage from "@/components/ProductImage";

export default function SpecificationsDesk() {
  const params = useParams();
  const id = params?.id;

  const { products, addToCart, activeRegion, formatPrice } = useAppEngine();
  const { t } = useTranslationEngine();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [reviews, setReviews] = useState([]);

  const product =
    (products || []).find((p) => String(p._id || p.id) === String(id)) ||
    products[0];
  const productId = String(product?._id || product?.id || "");

  useEffect(() => {
    if (!productId) return;
    api
      .get(`/reviews?product=${encodeURIComponent(productId)}`)
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]));
  }, [productId]);

  const isOutOfStock = product?.status?.toLowerCase() === "out of stock";
  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviews.length) *
            10,
        ) / 10
      : null;

  const renderStars = (rating) => {
    const stars = Math.max(1, Math.min(5, Math.round(rating || 0)));
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <DynamicNavbar />

      <main className="max-w-350 mx-auto px-4 py-12 w-full sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start flex-grow">
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl aspect-square flex items-center justify-center text-8xl shadow-sm relative overflow-hidden">
            <ProductImage
              src={product?.images?.[galleryIdx] || "📦"}
              alt={product?.name}
              emojiClassName="text-8xl"
            />

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
                type="button"
                onClick={() => setGalleryIdx(idx)}
                className={`w-12 h-12 rounded-xl text-xl border transition-all relative overflow-hidden ${
                  galleryIdx === idx
                    ? "border-emerald-600 bg-emerald-50 scale-105 shadow-sm"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ProductImage src={img || "📦"} emojiClassName="text-xl" />
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
            SKU: {product?.sku || "MK-GEN-000"} | Brand:{" "}
            {product?.brand || "Generic"}
          </p>

          <div className="text-2xl font-black text-slate-900 font-mono">
            {formatPrice(product?.discountPrice || product?.price || 0)}
          </div>

          {averageRating !== null && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="text-amber-500">
                {renderStars(averageRating)}
              </span>
              <span>
                {averageRating} / 5 ·{" "}
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>
          )}

          <button
            type="button"
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

      {/* Reviews section */}
      <section className="max-w-350 mx-auto px-4 pb-12 w-full sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono mb-4">
            Buyer Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium">
              No reviews yet for this product. Be the first to review it from
              your account dashboard.
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-100 rounded-xl p-4 bg-gray-50/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-black text-slate-800">
                      {review.user?.name || "Verified Buyer"}
                    </span>
                    <span className="text-amber-500 font-bold">
                      {renderStars(review.rating)}
                    </span>
                  </div>
                  {review.createdAt && (
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 font-medium mt-2">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <DynamicFooter />
    </div>
  );
}
