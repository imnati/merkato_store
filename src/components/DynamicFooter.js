"use client";
import React from "react";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function DynamicFooter() {
  const { t } = useTranslationEngine();

  return (
    <footer className="bg-[#0B1528] text-gray-400 text-xs py-8 border-t border-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-2 sm:px-6 lg:px-8">
        <p className="transition-all duration-200">
          {
            "© 2026 Merkato Store Marketplace . All multi-region routes secured."
          }
        </p>
      </div>
    </footer>
  );
}
