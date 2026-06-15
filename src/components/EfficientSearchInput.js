"use client";
import React, { useState, useEffect, useRef } from "react";

export default function EfficientSearchInput({
  onDebounceSearch,
  placeholder,
}) {
  const [term, setTerm] = useState("");

  const searchCallbackRef = useRef(onDebounceSearch);

  useEffect(() => {
    searchCallbackRef.current = onDebounceSearch;
  }, [onDebounceSearch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      searchCallbackRef.current(term);
    }, 350);

    return () => clearTimeout(delay);
  }, [term]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 text-sm rounded-xl ps-4 pe-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition-all"
      />

      <span className="absolute inset-y-0 end-4 flex items-center text-gray-400 select-none pointer-events-none">
        🔍
      </span>
    </div>
  );
}
