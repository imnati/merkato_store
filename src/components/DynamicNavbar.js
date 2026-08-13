"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppEngine, TARGET_REGIONS } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import EfficientSearchInput from "./EfficientSearchInput";
import CartDrawer from "./CartDrawer";

export default function DynamicNavbar() {
  const { cart, activeRegion, updateRegionSelection, user, isAuthenticated, logout } = useAppEngine();
  const { locale, t, switchLanguage } = useTranslationEngine();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculates total number of items in the cart
  const totalBasketUnits = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Synchronizes search input to update the live query parameters globally
  const handleSearchSubmit = (term) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Bar Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          {/* 💡 NEW FIXED BRAND LOGO ELEMENT */}
          <Link
            href="/"
            className="text-xl font-black tracking-tight sm:text-2xl shrink-0 select-none flex items-center gap-1"
          >
            {locale === "en" ? (
              <>
                <span className="font-[family-name:var(--font-caveat)] text-[#0B1528]">Merkato</span>{" "}
                <span className="text-[#0D1E3A] font-black">Store</span>
              </>
            ) : (
              // Keeps Arabic formatting looking correct natively
              t.brand
            )}
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <EfficientSearchInput
              onDebounceSearch={handleSearchSubmit}
              placeholder={t.searchPlaceholder}
            />
          </div>

          {/* Desktop Navigation Group - Hidden on Mobile/Tablet */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-600">
            {/* Region Selector */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
              <span className="text-sm">{activeRegion?.flag}</span>
              <select
                value={activeRegion?.code}
                onChange={(e) => updateRegionSelection(e.target.value)}
                className="bg-transparent focus:outline-none text-[11px] cursor-pointer"
              >
                {TARGET_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.code} ({r.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                onClick={() => switchLanguage("en")}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${locale === "en" ? "bg-white text-emerald-600 shadow-sm font-black" : "text-gray-400"}`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage("ar")}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${locale === "ar" ? "bg-white text-emerald-600 shadow-sm font-black" : "text-gray-400"}`}
              >
                AR
              </button>
            </div>

            {/* Auth / User Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/account" className="hover:text-emerald-600 transition">
                  👤 Dashboard
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded font-black hover:bg-orange-100 transition"
                  >
                    ADMIN
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="text-gray-500 hover:text-red-600 transition font-bold text-[10px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-emerald-600 transition font-bold">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-[#0B1528] text-white px-3 py-1.5 rounded-lg font-black hover:bg-slate-800 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Cart Button Icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-xs transition lg:hidden"
            >
              <span>🛒 {t.basketTitle}</span>
              <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {totalBasketUnits}
              </span>
            </button>
            <Link
              href="/cart"
              className="relative hidden lg:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
            >
              <span>🛒 {t.basketTitle}</span>
              <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {totalBasketUnits}
              </span>
            </Link>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-600 text-2xl p-1 focus:outline-none"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide-down Layout */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4 shadow-inner animate-fadeIn">
          <div className="space-y-2">
            <EfficientSearchInput
              onDebounceSearch={handleSearchSubmit}
              placeholder={t.searchPlaceholder}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-500">Region:</span>
            <div className="flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg">
              <span className="text-sm">{activeRegion?.flag}</span>
              <select
                value={activeRegion?.code}
                onChange={(e) => updateRegionSelection(e.target.value)}
                className="bg-transparent focus:outline-none text-[11px]"
              >
                {TARGET_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name} ({r.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-500">Language:</span>
            <div className="flex items-center bg-gray-200 p-0.5 rounded-lg border border-gray-300">
              <button
                onClick={() => switchLanguage("en")}
                className={`px-3 py-1 rounded text-xs font-bold ${locale === "en" ? "bg-white text-emerald-600" : "text-gray-500"}`}
              >
                English
              </button>
              <button
                onClick={() => switchLanguage("ar")}
                className={`px-3 py-1 rounded text-xs font-bold ${locale === "ar" ? "bg-white text-emerald-600" : "text-gray-500"}`}
              >
                العربية
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200 text-center text-xs font-bold">
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  className="bg-white border border-gray-200 py-2.5 rounded-xl text-gray-700"
                >
                  👤 Dashboard
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="bg-orange-50 text-orange-600 py-2.5 rounded-xl"
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="col-span-2 bg-red-50 text-red-600 py-2.5 rounded-xl border border-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="bg-white border border-gray-200 py-2.5 rounded-xl text-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#0B1528] text-white py-2.5 rounded-xl"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </header>
  );
}
