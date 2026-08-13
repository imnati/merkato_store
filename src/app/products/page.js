"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";

function CatalogGridContent() {
  const { products, addToCart, activeRegion, addToWishlist, removeFromWishlist, isInWishlist } = useAppEngine();
  const { t } = useTranslationEngine();
  const [selectedCat, setSelectedCat] = useState("All");

  const searchParams = useSearchParams();
  const searchFilter = searchParams.get("search") || "";

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCat === "All" || p.category === selectedCat;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        <aside className="bg-white p-5 border border-gray-100 rounded-2xl space-y-4 lg:sticky lg:top-24 h-fit">
          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            Categories
          </h3>
          <div className="flex flex-col space-y-1 text-xs font-bold">
            {[
              "All",
              "Electronics",
              "Fashion & clothing",
              "Groceries",
              "Beauty products",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-left px-3 py-2 rounded-lg transition-all ${
                  selectedCat === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-gray-50 active:scale-98"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm font-medium text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-white">
              {t.emptySearch || t.emptyCategory}
            </div>
          ) : (
            filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
                onToggleWishlist={(product) => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                isWishlisted={isInWishlist(p.id)}
                symbol={activeRegion.symbol}
              />
            ))
          )}
        </section>
      </main>

      <DynamicFooter />
    </div>
  );
}

export default function MasterCatalogGrid() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8 w-full sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <CatalogGridContent />
    </Suspense>
  );
}
