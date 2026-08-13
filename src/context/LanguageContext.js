"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const DICTIONARY = {
  en: {
    dir: "ltr",
    lang: "en",
    brand: "MERKATO STORE",
    subtitle: "Pan-African & Middle East Marketplace",
    searchPlaceholder: "Search 5,000+ regional products...",
    btnCart: "Add to Cart",
    basketTitle: "Basket Summary",
    totalEst: "Estimated Total",
    checkoutBtn: "Proceed to Checkout",
    categoryLabel: "Category",
    footerCopy:
      "© 2026 Merkato Store Marketplace Hub. All multi-region routes secured via PCI-DSS Level 1 specifications.",
    footerSecurity: "TLS 1.3 Secure Deployment Pipeline",
    emptyCategory: "No products found in this category.",
    emptySearch: "No products match your search criteria.",
    emptyHomeCategory: "No products registered under the \"{category}\" category.",
  },
  ar: {
    dir: "rtl",
    lang: "ar",
    brand: "متجر ميركاتو",
    subtitle: "التجارة الإلكترونية عبر أفريقيا والشرق الأوسط",
    searchPlaceholder: "ابحث في أكثر من ٥,٠٠٠ منتج...",
    btnCart: "أضف إلى السلة",
    basketTitle: "ملخص سلة التسوق",
    totalEst: "الإجمالي التقديري",
    checkoutBtn: "المتابعة لإتمام الشراء",
    categoryLabel: "التصنيف",
    footerCopy:
      "© ٢٠٢٦ مركز سوق متجر ميركاتو. جميع المسارات متعددة المناطق مؤمنة وفقًا لمواصفات PCI-DSS من المستوى ١.",
    footerSecurity: "قناة النشر الآمنة TLS 1.3",
    emptyCategory: "لا توجد منتجات في هذا التصنيف.",
    emptySearch: "لا توجد منتجات تطابق معايير البحث الخاصة بك.",
    emptyHomeCategory: "لا توجد منتجات مسجلة ضمن تصنيف \"{category}\".",
  },
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedLocale = localStorage.getItem("MERKATO_LOCALE");
      if (cachedLocale && DICTIONARY[cachedLocale]) {
        setLocale(cachedLocale);
      }
    }
  }, []);

  const switchLanguage = (langCode) => {
    if (DICTIONARY[langCode]) {
      setLocale(langCode);
      if (typeof window !== "undefined") {
        localStorage.setItem("MERKATO_LOCALE", langCode);
      }
    }
  };

  return (
    <LanguageContext.Provider
      value={{ locale, t: DICTIONARY[locale], switchLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslationEngine = () => useContext(LanguageContext);
