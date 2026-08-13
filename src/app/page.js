"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DynamicNavbar from "@/components/DynamicNavbar";
import DynamicFooter from "@/components/DynamicFooter";
import ProductCard from "@/components/ProductCard";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import Link from "next/link";

/* ---- UI icon set (crisp, brand-consistent) ---- */
const icons = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 3v3m6.37 2.63L16.7 10.3M21 12h-3m2.37 6.63-5.06-1.36M12 18v-3M5.63 14.37l2.07 2.07L5 21z" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
};

function HomepageContent() {
  const {
    products,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    activeRegion,
    formatPrice,
  } = useAppEngine();

  const featuredProducts = (products || []).filter((p) => p.isFeatured);
  const discountedProducts = (products || []).filter(
    (p) => typeof p.discountPrice === "number" && p.discountPrice < p.price,
  );

  const { t } = useTranslationEngine();
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchFilter = searchParams.get("search") || "";

  const [activeCategory, setActiveCategory] = useState("All");

  const AVAILABLE_CATEGORIES = [
    { id: "All", label: t?.allProducts || "ALL PRODUCTS" },
    { id: "Electronics", label: t?.electronics || "ELECTRONICS" },
    { id: "Fashion & clothing", label: t?.fashion || "FASHION & CLOTHING" },
    { id: "Groceries", label: t?.groceries || "GROCERIES" },
    { id: "Beauty products", label: t?.beauty || "BEAUTY PRODUCTS" },
    { id: "Household items", label: t?.household || "HOUSEHOLD ITEMS" },
    { id: "Accessories", label: t?.accessories || "ACCESSORIES" },
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

  const processedFilteredProducts = (products || []).filter((p) => {
    const matchesSearch =
      p?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p?.brand?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      false;

    const matchesCategory =
      activeCategory === "All" || p?.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const totalCost = (cart || []).reduce(
    (sum, item) => sum + (item.activePrice || item.price || 0) * item.quantity,
    0,
  );

  const noResultsParts = (t.noProductsFound || "No items were found under category {term}.").split("{term}");

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <DynamicNavbar />

      <main className="max-w-[1400px] mx-auto px-4 py-6 w-full sm:px-6 lg:px-8 grow space-y-10">
        {/* Trust strip */}
        <div id="categories" className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
          {[
            { icon: icons.truck, title: t?.trustFreight || "Fast Freight", sub: t?.trustFreightSub || "Cross-border delivery" },
            { icon: icons.shield, title: t?.trustSecure || "Secure Payments", sub: t?.trustSecureSub || "Stripe encrypted" },
            { icon: icons.globe, title: t?.trustCurrency || "Local Currency", sub: t?.trustCurrencySub || "6 regional markets" },
            { icon: icons.clock, title: t?.trustSupport || "24/7 Support", sub: t?.trustSupportSub || "Always available" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3 rounded-2xl bg-white border border-slate-100 px-4 py-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <span className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">{f.icon}</span>
              <div className="min-w-0">
                <p className="text-slate-900 font-extrabold truncate">{f.title}</p>
                <p className="text-[11px] text-slate-400 truncate font-medium">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category filter bar */}
        <nav id="catalog" className="sticky top-20 z-30 bg-white/85 backdrop-blur border border-slate-100 rounded-2xl p-2 shadow-sm overflow-x-auto custom-scrollbar flex items-center gap-1.5 scroll-smooth">
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
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap mobile-touch-optimal ${
                  isCurrentlySelected
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Products + Basket */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main grid */}
          <section className="lg:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black uppercase tracking-widest text-slate-900 font-mono">
                {searchFilter
                  ? (t.resultsFor || "Results for {term}").replace("{term}", searchFilter)
                  : t?.marketplaceTitle || "Marketplace"}
              </h2>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-100">
                {(t.itemsCount || "{n} items").replace("{n}", processedFilteredProducts.length)}
              </span>
            </div>

            <div
              key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in scroll-mt-28"
            >
              {processedFilteredProducts.length === 0 ? (
                <div
                  suppressHydrationWarning={true}
                  className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">{icons.search}</span>
                  <p className="text-sm font-semibold text-slate-500">
                    {noResultsParts[0]}
                    <span className="text-orange-600 font-black uppercase font-mono">{currentCategoryLabel}</span>
                    {noResultsParts[1]}
                  </p>
                </div>
              ) : (
                processedFilteredProducts.map((p) => (
                  <ProductCard
                    key={p._id || p.id}
                    product={p}
                    onAddToCart={addToCart}
                    symbol={activeRegion?.symbol || "د.إ"}
                    showDiscount={false}
                  />
                ))
              )}
            </div>
          </section>

          {/* Basket sidebar */}
          <aside className="lg:col-span-3 bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-4 lg:sticky lg:top-32">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-slate-800 border-b pb-3 tracking-wider font-mono">
              <span className="text-emerald-600">{icons.cart}</span>
              {t?.basketTitle || "Basket Summary"}
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-3">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50">{icons.box}</span>
                <p className="text-xs font-semibold">{t?.basketEmpty || "Basket is empty."}</p>
                <Link href="#catalog" className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700">
                  {t?.startBrowsing || "Start browsing"}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-50 custom-scrollbar text-xs">
                  {cart.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="flex items-center justify-between font-semibold pt-3 first:pt-0 gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-slate-400 font-mono text-[10px] mt-0.5 font-bold">
                          {formatPrice((item.activePrice || item.price || 0) * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) removeFromCart(item.id);
                            else updateCartQty(item.id, item.quantity - 1);
                          }}
                          className="h-6 w-6 rounded-md bg-slate-100 font-black text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                          −
                        </button>
                        <span className="font-bold font-mono px-0.5 min-w-[14px] text-center text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          className="h-6 w-6 rounded-md bg-slate-100 font-black text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-1 rounded-md p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title={t?.remove || "Remove item"}
                        >
                          {icons.trash}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline justify-between bg-slate-50/80 border-t border-slate-100 p-3 rounded-xl text-xs font-black text-slate-900">
                  <span>{t?.totalEst || "Estimated Total"}:</span>
                  <span className="text-emerald-600 font-mono text-sm font-black">{formatPrice(totalCost)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="w-full text-center block bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-xs font-black py-3.5 rounded-xl uppercase tracking-wider font-mono shadow-lg shadow-orange-600/20 hover:-translate-y-0.5 transition-all active:scale-[0.99]"
                >
                  {t?.checkoutBtn || "Proceed to Checkout"}
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* Featured */}
        {featuredProducts.length > 0 && (
          <section className="scroll-mt-28">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900 font-mono">
                <span className="text-emerald-600">{icons.flame}</span>
                {t?.featuredTitle || "Featured Products"}
              </h2>
              <Link href="/products" className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors">
                {t?.viewAll || "View all"} {icons.arrow}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                  onAddToCart={addToCart}
                  symbol={activeRegion?.symbol}
                  showDiscount={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Special Offers */}
        {discountedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900 font-mono">
                <span className="text-red-500">{icons.sparkle}</span>
                {t?.specialOffers || "Special Offers"}
              </h2>
              <Link href="/products" className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors">
                {t?.viewAll || "View all"} {icons.arrow}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {discountedProducts.map((p) => (
                <div key={p._id || p.id} className="relative">
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm">
                    {t?.sale || "Sale"}
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
          Loading store...
        </div>
      }
    >
      <HomepageContent />
    </Suspense>
  );
}