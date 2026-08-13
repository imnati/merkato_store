"use client";

import React from "react";

export default function ScrollableTable({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-x-auto custom-scrollbar pb-2">
        {children}
      </div>
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
    </div>
  );
}
