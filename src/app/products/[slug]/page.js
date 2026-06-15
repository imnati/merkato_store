"use client";
import React from "react";
import { useParams } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import ProductCard from "@/components/ProductCard";
import { useAppEngine } from "@/context/AppContext";

export default function SegmentRouteFeed() {
  const { slug } = useParams();

  const { products, addToCart, activeRegion } = useAppEngine();

  const normalized = slug ? slug.replace("category-", "").toLowerCase() : "";

  const results = products.filter((p) =>
    p.category?.toLowerCase().includes(normalized),
  );

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicNavbar />

      <main className="max-w-7xl mx-auto px-4 py-12 w-full sm:px-6 lg:px-8 space-y-6 grow">
        <h2 className="text-xl font-black text-slate-900 border-b pb-2 uppercase tracking-tight font-mono">
          {normalized || "Unknown"} REGISTRY COLLECTION
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm font-medium text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-white">
              በዚህ ምድብ ውስጥ ምንም አይነት ምርት አልተገኘም።
            </div>
          ) : (
            results.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
                symbol={activeRegion?.symbol || "$"}
              />
            ))
          )}
        </div>
      </main>

      <DynamicFooter />
    </div>
  );
}
