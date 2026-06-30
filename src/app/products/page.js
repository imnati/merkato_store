"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import ProductCard from "@/components/ProductCard";
import { useAppEngine } from "@/context/AppContext";

function CatalogGridContent() {
  const { products, addToCart, activeRegion } = useAppEngine();
  const [selectedCat, setSelectedCat] = useState("All");

  const searchParams = useSearchParams();
  const searchFilter = searchParams.get("search") || "";

  // Helper to normalize strings for comparison
  const cleanToken = (str) =>
    str
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "") || "";

  // Get count for categories dynamically
  const getCount = (cat) => {
    if (cat === "All") return products.length;
    return products.filter((p) => cleanToken(p.category) === cleanToken(cat))
      .length;
  };

  const filtered = (products || []).filter((p) => {
    const matchesCategory =
      selectedCat.toLowerCase() === "all" ||
      cleanToken(p.category) === cleanToken(selectedCat);

    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/40">
      <DynamicNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        {/* Sidebar Navigation */}
        <aside className="bg-white p-5 border border-gray-100 rounded-2xl space-y-4 lg:sticky lg:top-24 h-fit shadow-sm">
          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-wider font-mono px-3">
            Categories
          </h3>
          <div className="flex flex-col space-y-1 text-xs font-bold font-mono">
            {[
              "All",
              "Electronics",
              "Fashion & clothing",
              "Groceries",
              "Beauty products",
              "Household items",
              "Accessories",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`flex justify-between items-center px-3 py-2.5 rounded-xl transition-all border uppercase tracking-wider ${
                  selectedCat === cat
                    ? "bg-slate-900 text-white border-transparent shadow-md"
                    : "bg-white text-slate-600 border-transparent hover:bg-gray-50"
                }`}
              >
                {cat}
                <span className="opacity-50 text-[10px]">
                  ({getCount(cat)})
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <section className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4 bg-white border border-dashed border-gray-200 rounded-3xl">
              <span className="text-4xl block">🔍</span>
              <p className="text-sm font-bold text-gray-400">
                No products found for this category.
              </p>
              <button
                onClick={() => setSelectedCat("All")}
                className="text-emerald-600 font-black text-xs underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
                symbol={activeRegion?.symbol || "$"}
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
        <div className="min-h-screen flex items-center justify-center text-xs font-mono animate-pulse text-slate-400">
          Loading Catalog Pipeline...
        </div>
      }
    >
      <CatalogGridContent />
    </Suspense>
  );
}
