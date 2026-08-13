"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import ProductCard from "@/components/ProductCard";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";

function CatalogGridContent() {
  const { t } = useTranslationEngine();
  const { products, addToCart, activeRegion } = useAppEngine();
  const [selectedCat, setSelectedCat] = useState("All");

  const catLabels = {
    All: t.categoryAll,
    Electronics: t.electronics,
    "Fashion & clothing": t.fashion,
    Groceries: t.groceries,
    "Beauty products": t.beauty,
    "Household items": t.household,
    Accessories: t.accessories,
  };

  const searchParams = useSearchParams();
  const searchFilter = searchParams.get("search") || "";

  const cleanToken = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
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

      <main className="max-w-350 mx-auto px-4 py-8 w-full sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        <aside className="bg-white p-5 border border-gray-100 rounded-2xl space-y-4 lg:sticky lg:top-24 h-fit shadow-xs">
          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-wider font-mono">
            {t.categoriesFilter}
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
                className={`text-left px-3 py-2.5 rounded-xl transition-all border uppercase tracking-wider ${
                  selectedCat.toLowerCase() === cat.toLowerCase()
                    ? "bg-slate-900 text-white border-transparent shadow-sm"
                    : "bg-white text-slate-600 border-transparent hover:bg-gray-50 active:scale-98"
                }`}
              >
                {catLabels[cat]}
              </button>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm font-semibold text-gray-400 bg-white border border-dashed border-gray-200 rounded-3xl p-4 shadow-inner">
              {t.noItemsFound}
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
  const { t } = useTranslationEngine();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs font-mono text-slate-400 animate-pulse">
          {t.loadingProducts}
        </div>
      }
    >
      <CatalogGridContent />
    </Suspense>
  );
}
