"use client";
import React from "react";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function DocumentWrapper({ children }) {
  const { t } = useTranslationEngine();

  const activeLang = t?.lang || "en";
  const activeDir = t?.dir || "ltr";

  return (
    <html lang={activeLang} dir={activeDir} suppressHydrationWarning={true}>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col justify-between custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
