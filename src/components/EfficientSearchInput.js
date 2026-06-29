"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function EfficientSearchInput({
  onDebounceSearch,
  placeholder,
}) {
  const [term, setTerm] = useState("");
  // 🧭 Autocomplete local state engine
  const [suggestions, setSuggestions] = useState([]);

  const { getTranslatedProducts } = useAppEngine();
  const { locale } = useTranslationEngine();
  const searchCallbackRef = useRef(onDebounceSearch);

  useEffect(() => {
    searchCallbackRef.current = onDebounceSearch;
  }, [onDebounceSearch]);

  // Handles both search debounce and autocomplete suggestions filtration
  useEffect(() => {
    const delay = setTimeout(() => {
      searchCallbackRef.current(term);

      // If user types 2 or more characters, extract and display matching items
      if (term.trim().length >= 2 && getTranslatedProducts) {
        const activeCatalog = getTranslatedProducts(locale);
        const matches = activeCatalog
          .filter(
            (product) =>
              product.name.toLowerCase().includes(term.toLowerCase()) ||
              product.brand.toLowerCase().includes(term.toLowerCase()),
          )
          .slice(0, 5); // Limit to top 5 predictive suggestion matches
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [term, getTranslatedProducts, locale]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full bg-white border border-gray-200 text-sm rounded-xl ps-4 pe-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition-all font-medium"
      />

      <span className="absolute inset-y-0 end-4 flex items-center text-gray-400 select-none pointer-events-none">
        🔍
      </span>

      {/* ✅ NEW: Floating Autocomplete Suggestions Dropdown Box */}
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden text-left py-1 animate-fadeIn">
          {suggestions.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                setTerm(product.name);
                setSuggestions([]); // Closes suggestions box on option click
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold truncate block transition-colors"
            >
              ✨ {product.name}{" "}
              <span className="text-[10px] text-emerald-600 font-mono font-black ml-1">
                ({product.displayCategory || product.category})
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
