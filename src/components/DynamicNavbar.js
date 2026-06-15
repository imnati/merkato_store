"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppEngine, TARGET_REGIONS } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import EfficientSearchInput from "./EfficientSearchInput";

export default function DynamicNavbar() {
  const {
    cart,
    activeRegion,
    updateRegionSelection,
    user,
    removeFromCart,
    logoutUser,
  } = useAppEngine();

  const { locale, t, switchLanguage } = useTranslationEngine();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  const [tempRegionCode, setTempRegionCode] = useState(
    activeRegion?.code || "AE",
  );
  const [tempLang, setTempLang] = useState(locale || "en");
  const [zipCode, setZipCode] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const currentT = t || {};
  // const currentT = mounted ? t || {} : {};

  const safeCart = cart || [];
  const totalBasketUnits = safeCart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalCost = safeCart.reduce(
    (sum, item) => sum + (item.activePrice || item.price || 0) * item.quantity,
    0,
  );

  const handleSearchSubmit = (term) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("search", term);
    else params.delete("search");
    router.push(`/?${params.toString()}`);
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    updateRegionSelection(tempRegionCode);
    setLocationDropdownOpen(false);
  };

  const handleSaveLangAndCurrency = (e) => {
    e.preventDefault();
    switchLanguage(tempLang);
    updateRegionSelection(tempRegionCode);
    setLangDropdownOpen(false);
  };

  const displayBrand = (
    <span className="text-xl font-black tracking-tight sm:text-2xl font-mono shrink-0 select-none">
      {!mounted ? (
        <>
          <span className="text-orange-600">MERKATO</span>{" "}
          <span className="text-slate-800">STORE</span>
        </>
      ) : (
        <>
          <span className="text-orange-600 hover:text-orange-700 transition-colors">
            {currentT?.brandNamePart1 || "MERKATO"}
          </span>{" "}
          <span className="text-slate-800">
            {currentT?.brandNamePart2 || "STORE"}
          </span>
        </>
      )}
    </span>
  );
  const displayFlag = mounted ? activeRegion?.flag : "🌐";
  const displayName = mounted ? activeRegion?.name : "Global";
  const displayCurrency = mounted ? activeRegion?.currency || "AED" : "AED";
  const displaySymbol = mounted ? activeRegion?.symbol || "د.إ" : "د.إ";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex items-center">
            {displayBrand}
          </Link>

          <div
            className="hidden md:flex flex-1 max-w-md"
            suppressHydrationWarning={true}
          >
            <EfficientSearchInput
              onDebounceSearch={handleSearchSubmit}
              placeholder={
                currentT?.searchPlaceholder ||
                "Search 5,000+ regional products..."
              }
            />
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-600">
            <div
              className="relative py-2"
              onMouseEnter={() => setLocationDropdownOpen(true)}
              onMouseLeave={() => setLocationDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex flex-col text-left bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-slate-700 cursor-pointer hover:bg-gray-100 transition"
              >
                <span
                  suppressHydrationWarning={true}
                  className="text-[9px] text-gray-400 uppercase font-mono tracking-wider font-bold"
                >
                  {currentT?.deliverTo || "DELIVER TO"}
                </span>
                <span
                  className="flex items-center gap-1 font-black text-[11px]"
                  suppressHydrationWarning={true}
                >
                  <span>{displayFlag}</span> {displayName} ▼
                </span>
              </button>
              {locationDropdownOpen && (
                <form
                  onSubmit={handleSaveLocation}
                  className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 z-50 text-slate-800 space-y-4 text-left animate-fadeIn"
                >
                  <h4
                    suppressHydrationWarning={true}
                    className="text-xs font-black font-mono border-b pb-2 uppercase tracking-wider text-slate-400"
                  >
                    {currentT?.deliverTo || "Specify your location"}
                  </h4>
                  <Link
                    href="/auth/login"
                    suppressHydrationWarning={true}
                    className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-2.5 rounded-xl uppercase font-mono shadow-sm transition"
                  >
                    {currentT?.signIn || "SIGN IN"}
                  </Link>
                  <div className="flex items-center justify-center text-gray-300 text-[10px] font-bold font-mono uppercase tracking-widest my-1">
                    <span className="border-b w-1/3 border-gray-200 mr-2"></span>
                    Or
                    <span className="border-b w-1/3 border-gray-200 ml-2"></span>
                  </div>
                  <select
                    value={tempRegionCode}
                    onChange={(e) => setTempRegionCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs font-bold p-3 rounded-xl focus:outline-none cursor-pointer"
                  >
                    {TARGET_REGIONS.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.flag} {r.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs font-mono rounded-xl p-3 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-center text-xs py-2.5 rounded-xl uppercase tracking-wider font-mono shadow transition"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>

            <div
              className="relative py-2"
              onMouseEnter={() => setLangDropdownOpen(true)}
              onMouseLeave={() => setLangDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl text-slate-700 cursor-pointer hover:bg-gray-100 transition font-black"
                suppressHydrationWarning={true}
              >
                <span>🌐</span>{" "}
                <span>
                  {mounted ? locale?.toUpperCase() : "EN"}-{displayCurrency} ▼
                </span>
              </button>
              {langDropdownOpen && (
                <form
                  onSubmit={handleSaveLangAndCurrency}
                  className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 z-50 text-slate-800 space-y-4 text-left animate-fadeIn"
                >
                  <h4 className="text-xs font-black font-mono border-b pb-2 uppercase tracking-wider text-slate-400">
                    Set language and currency
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 block tracking-wider font-mono">
                      Language
                    </label>
                    <select
                      value={tempLang}
                      onChange={(e) => setTempLang(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs font-bold p-3 rounded-xl focus:outline-none cursor-pointer text-slate-800"
                    >
                      <option value="en">English (EN)</option>
                      <option value="ar">العربية (AR)</option>
                      <option value="am">አማርኛ (AM)</option>
                      <option value="fr">Français (FR)</option>
                      <option value="es">Español (ES)</option>
                      <option value="pt">Português (PT)</option>
                      <option value="sw">Kiswahili (SW)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 block tracking-wider font-mono">
                      Currency
                    </label>
                    <select
                      value={tempRegionCode}
                      onChange={(e) => setTempRegionCode(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs font-bold p-3 rounded-xl focus:outline-none cursor-pointer text-slate-800"
                    >
                      {TARGET_REGIONS.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.currency} - {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-center text-xs py-3 rounded-xl uppercase tracking-wider font-mono shadow transition"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>

            <Link
              href="/account"
              suppressHydrationWarning={true}
              className="hover:text-emerald-600 transition flex items-center gap-1"
            >
              👤 {currentT?.dashboard || "Dashboard"}
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                suppressHydrationWarning={true}
                className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded font-black hover:bg-orange-100 transition font-mono text-[11px]"
              >
                {currentT?.adminBadge || "ADMIN"}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0 relative">
            <div
              className="relative py-2"
              onMouseEnter={() => setCartDropdownOpen(true)}
              onMouseLeave={() => setCartDropdownOpen(false)}
            >
              <Link
                href="/cart"
                suppressHydrationWarning={true}
                className="relative flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                <span>🛒 {currentT?.basketTitle || "Basket Summary"}</span>
                <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {totalBasketUnits}
                </span>
              </Link>

              {cartDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 z-50 text-slate-800 animate-fadeIn text-center space-y-4">
                  <h4
                    suppressHydrationWarning={true}
                    className="text-left text-xs font-black font-mono border-b pb-2 uppercase tracking-wider text-slate-400"
                  >
                    {currentT?.basketTitle || "Basket Summary"}
                  </h4>
                  {safeCart.length === 0 ? (
                    <div className="py-6 space-y-2">
                      <span className="text-4xl block">🛒</span>
                      <p
                        suppressHydrationWarning={true}
                        className="text-xs font-bold text-slate-600"
                      >
                        {currentT?.basketEmpty || "Basket is empty."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 text-left text-xs max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {safeCart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-bold truncate text-slate-800">
                                {item.name}
                              </p>
                              <p
                                className="text-[10px] font-mono text-gray-400 font-bold"
                                suppressHydrationWarning={true}
                              >
                                {displaySymbol}
                                {(item.activePrice || item.price || 0).toFixed(
                                  2,
                                )}{" "}
                                x {item.quantity}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-600 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 flex justify-between font-black text-slate-900 border-t border-gray-100">
                        <span>Total:</span>
                        <span
                          className="text-emerald-600 font-mono"
                          suppressHydrationWarning={true}
                        >
                          {displaySymbol}
                          {totalCost.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  <Link
                    href="/cart"
                    suppressHydrationWarning={true}
                    className="block w-full text-center border border-slate-900 hover:bg-slate-50 text-slate-900 font-black text-xs py-2.5 rounded-xl transition font-mono"
                  >
                    {currentT?.basketTitle || "Basket Summary"}
                  </Link>
                </div>
              )}
            </div>

            <div
              className="hidden lg:flex items-center gap-3 text-xs font-black uppercase font-mono tracking-wider border-l border-gray-200 pl-4"
              suppressHydrationWarning={true}
            >
              {mounted && (user?.id || user?.email) ? (
                <button
                  type="button"
                  onClick={() => logoutUser?.()}
                  className="text-gray-400 hover:text-red-600 transition flex items-center gap-0.5 cursor-pointer font-black"
                >
                  {currentT?.logout || "Logout"} 🚪
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-slate-700 hover:text-orange-600 transition"
                  >
                    {currentT?.signIn || "SIGN IN"}
                  </Link>
                  <span>|</span>

                  <Link
                    href="/auth/signup"
                    className="text-slate-700 hover:text-orange-600 transition"
                  >
                    {currentT?.signUp || "SIGN UP"}
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-600 text-2xl p-1 focus:outline-none select-none"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4 font-semibold text-sm text-slate-700 animate-slideDown">
          <div className="pb-2 border-b border-gray-100">
            <EfficientSearchInput
              onDebounceSearch={handleSearchSubmit}
              placeholder={currentT?.searchPlaceholder || "Search..."}
            />
          </div>

          <div className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-xl">
            <span
              suppressHydrationWarning={true}
              className="text-gray-400 uppercase font-mono font-bold"
            >
              {currentT?.deliverTo || "DELIVER TO"}:
            </span>
            <div
              className="flex items-center gap-1"
              suppressHydrationWarning={true}
            >
              <span>{displayFlag}</span>
              <select
                value={activeRegion?.code}
                onChange={(e) => updateRegionSelection(e.target.value)}
                className="bg-transparent focus:outline-none font-bold text-slate-800 cursor-pointer"
              >
                {TARGET_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name} ({r.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-xl">
            <span className="text-gray-400 uppercase font-mono font-bold">
              Language:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => switchLanguage("en")}
                className={`px-3 py-1 rounded text-xs font-bold transition ${locale === "en" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => switchLanguage("am")}
                className={`px-3 py-1 rounded text-xs font-bold transition ${locale === "am" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}
              >
                አማርኛ
              </button>
            </div>
          </div>

          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            suppressHydrationWarning={true}
            className="block py-2 hover:text-emerald-600 transition"
          >
            👤 {currentT?.dashboard || "Dashboard"}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              suppressHydrationWarning={true}
              className="block py-2 text-orange-600 font-bold font-mono"
            >
              ⚙️ {currentT?.adminBadge || "ADMIN"}
            </Link>
          )}

          <div
            className="pt-2 border-t border-gray-100 flex flex-col gap-3 text-xs font-bold"
            suppressHydrationWarning={true}
          >
            {mounted && (user?.id || user?.email) ? (
              <button
                type="button"
                onClick={() => {
                  logoutUser?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center bg-red-50 text-red-600 py-2.5 rounded-xl font-bold"
              >
                {currentT?.logout || "Logout"} 🚪
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-gray-50 py-2.5 rounded-xl"
                >
                  {currentT?.signIn || "SIGN IN"}
                </Link>

                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-orange-600 text-white py-2.5 rounded-xl shadow"
                >
                  {currentT?.signUp || "SIGN UP"}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
