"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import ProductCard from "@/components/ProductCard";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import Link from "next/link";

/**
 * HomepageContent Component
 * Extended implementation featuring:
 * 1. Multi-layered Filtering (Search, Category, Price, Brand)
 * 2. Advanced Multi-Criteria Sorting Engine
 * 3. State Persistence and Responsive UI Architecture
 */
function HomepageContent() {
  const {
    products,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    activeRegion,
  } = useAppEngine();

  // --- DERIVED PRODUCT LISTS ---
  const featuredProducts = (products || []).filter((p) => p.isFeatured);
  const discountedProducts = (products || []).filter(
    (p) => typeof p.discountPrice === "number" && p.discountPrice < p.price,
  );

  const { t, locale } = useTranslationEngine();
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchFilter = searchParams.get("search") || "";

  // --- FILTER & SORT STATES ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [activeBrand, setActiveBrand] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);
  if (!isMounted) return null;

  // --- CATEGORY CONFIGURATION ---
  const AVAILABLE_CATEGORIES = [
    { id: "All", label: t?.allProducts || "ALL PRODUCTS" },
    { id: "Electronics", label: t?.electronics || "ELECTRONICS" },
    { id: "Fashion & clothing", label: t?.fashion || "FASHION & CLOTHING" },
    { id: "Groceries", label: t?.groceries || "GROCERIES" },
    { id: "Beauty products", label: t?.beauty || "BEAUTY PRODUCTS" },
    { id: "Household items", label: t?.household || "HOUSEHOLD ITEMS" },
    { id: "Accessories", label: t?.accessories || "ACCESSORIES" },
  ];

  // --- DYNAMIC BRAND MAPPING ---
  const brands = [
    "All",
    ...new Set((products || []).map((p) => p.brand).filter(Boolean)),
  ];

  const currentCategoryLabel =
    AVAILABLE_CATEGORIES.find((cat) => cat.id === activeCategory)?.label ||
    activeCategory;

  const normalizeToken = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
  };

  // --- ADVANCED FILTER & SORT PIPELINE ---
  const processedFilteredProducts = (products || [])
    .filter((p) => {
      const matchesSearch =
        p?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p?.brand?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        false;
      const matchesCategory =
        activeCategory === "All" || p?.category === activeCategory;
      const matchesPrice = (p.activePrice || p.price || 0) <= maxPrice;
      const matchesBrand = activeBrand === "All" || p?.brand === activeBrand;
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand;
    })
    .sort((a, b) => {
      // Numerical Price Sorting
      if (sortBy === "price-asc")
        return (a.activePrice || a.price) - (b.activePrice || b.price);
      if (sortBy === "price-desc")
        return (b.activePrice || b.price) - (a.activePrice || a.price);

      // Popularity/Rating Sorting (Fallbacks provided)
      if (sortBy === "popularity")
        return (b.salesCount || 0) - (a.salesCount || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);

      // Chronological Sorting
      if (sortBy === "newest")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);

      return 0;
    });

  const totalCost = (cart || []).reduce(
    (sum, item) => sum + (item.activePrice || item.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <DynamicNavbar />

      <main className="max-w-[1400px] mx-auto px-4 py-8 w-full sm:px-6 lg:px-8 grow space-y-8">
        <section className="bg-gradient-to-r from-[#0D1E3A] via-[#112952] to-[#0A172E] rounded-3xl p-12 text-center text-white shadow-xl border border-slate-800 animate-fade-in">
          <h1 className="text-3xl font-black sm:text-4xl md:text-5xl tracking-tight leading-tight font-mono uppercase">
            {t?.subtitle || "Pan-African & Middle East Marketplace"}
          </h1>
        </section>

        {/* --- DISCOVERY BAR (EXPANDED LAYOUT) --- */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="overflow-x-auto custom-scrollbar flex items-center gap-1.5 scroll-smooth">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const isCurrentlySelected =
                normalizeToken(activeCategory) === normalizeToken(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (searchFilter) router.push("/");
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border ${isCurrentlySelected ? "bg-slate-900 text-white border-transparent shadow-md scale-[1.01]" : "bg-white text-gray-500 border-gray-100 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 font-mono">
                Max Price: {activeRegion?.symbol || "$"} {maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max="200000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 font-mono">
                Select Brand
              </label>
              <select
                value={activeBrand}
                onChange={(e) => setActiveBrand(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-bold p-3 rounded-xl focus:outline-none cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 font-mono">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-bold p-3 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Average Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- MAIN PRODUCT GRID AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div
            key={activeCategory + activeBrand + sortBy}
            className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in"
          >
            {processedFilteredProducts.length === 0 ? (
              <div
                suppressHydrationWarning={true}
                className="col-span-full py-20 text-center text-sm font-semibold text-gray-400 bg-white border border-dashed border-gray-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center space-y-2"
              >
                <span className="text-3xl">🔍</span>
                <p className="text-slate-500 font-bold">
                  {t?.noProductsFound || "No items were found under category"}{" "}
                  <span className="text-orange-600 font-black uppercase font-mono">
                    {currentCategoryLabel}
                  </span>
                  .
                </p>
              </div>
            ) : (
              processedFilteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  symbol={activeRegion?.symbol || "د.إ"}
                  showDiscount={false}
                />
              ))
            )}
          </div>

          {/* --- BASKET SUMMARY (RETAINED EXACT ORIGINAL LOGIC) --- */}
          <aside className="lg:col-span-3 bg-white p-5 border border-gray-100 rounded-2xl shadow-sm space-y-4 lg:sticky lg:top-28">
            <h3 className="text-xs font-black uppercase text-slate-800 border-b pb-2 tracking-wider font-mono">
              🛒 {t?.basketTitle || "Basket Summary"}
            </h3>
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-400 space-y-1">
                <span className="text-2xl block">📥</span>
                <p className="text-xs font-semibold">
                  {t?.basketEmpty || "Basket is empty."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-50 custom-scrollbar text-xs">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between font-semibold pt-3 first:pt-0 gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-400 font-mono text-[10px] mt-0.5 font-bold">
                          {activeRegion?.symbol || "د.إ"}
                          {(
                            (item.activePrice || item.price || 0) *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) removeFromCart(item.id);
                            else updateCartQty(item.id, item.quantity - 1);
                          }}
                          className="bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-500 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="font-bold font-mono px-0.5">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(item.id, item.quantity + 1)
                          }
                          className="bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-500 hover:bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-100 bg-slate-50/80 p-3 rounded-xl flex items-baseline justify-between text-xs font-black text-slate-900">
                  <span>{t?.totalEst || "Estimated Total"}:</span>
                  <span className="text-emerald-600 font-mono text-sm font-black">
                    {activeRegion?.symbol || "د.إ"}
                    {totalCost.toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="w-full text-center block bg-orange-600 hover:bg-orange-700 text-white text-xs font-black py-3.5 rounded-xl uppercase tracking-wider font-mono shadow transition-all active:scale-[0.99]"
                >
                  {t?.checkoutBtn || "Proceed to Checkout"}
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* --- FEATURED SECTION --- */}
        {featuredProducts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 font-mono border-l-4 border-emerald-500 pl-3">
              Featured Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  symbol={activeRegion?.symbol}
                  showDiscount={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- SPECIAL OFFERS SECTION --- */}
        {discountedProducts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-red-600 mb-4 font-mono border-l-4 border-red-500 pl-3">
              Special Offers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {discountedProducts.map((p) => (
                <div key={p.id} className="relative">
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    Sale
                  </div>
                  <ProductCard
                    product={p}
                    onAddToCart={addToCart}
                    symbol={activeRegion?.symbol}
                    showDiscount={true}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <DynamicFooter />
    </div>
  );
}

export default function HomepageFeed() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs font-mono text-slate-400 animate-pulse">
          Loading Marketplace Interface Pipeline...
        </div>
      }
    >
      <HomepageContent />
    </Suspense>
  );
}
