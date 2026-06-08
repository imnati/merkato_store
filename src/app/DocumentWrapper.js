"use client";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function DocumentWrapper({ children }) {
  const { t } = useTranslationEngine();

  return (
    <html lang={t?.lang || "en"} dir={t?.dir || "ltr"} suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col justify-between custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
