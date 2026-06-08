"use client";
import React, { createContext, useContext, useState } from "react";

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
    footerCopy:
      "© 2026 Merkato Store Marketplace Hub. All multi-region routes secured via PCI-DSS Level 1 specifications.",
    footerSecurity: "TLS 1.3 Secure Deployment Pipeline",
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
    // FIXED: English strings replaced with accurate Arabic translations
    footerCopy:
      "© ٢٠٢٦ مركز سوق متجر ميركاتو. جميع المسارات متعددة المناطق مؤمنة وفقًا لمواصفات PCI-DSS من المستوى ١.",
    footerSecurity: "قناة النشر الآمنة TLS 1.3",
  },
};

export function LanguageProvider({ children }) {
  // FIXED: Lazy initialization safely reads local storage before initial paint
  const [locale, setLocale] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedLocale = localStorage.getItem("MERKATO_LOCALE");
      return cachedLocale && DICTIONARY[cachedLocale] ? cachedLocale : "en";
    }
    return "en";
  });

  // Note: The old useEffect hook is completely removed now!

  const switchLanguage = (langCode) => {
    if (DICTIONARY[langCode]) {
      setLocale(langCode);
      // FIXED: Added safety guard to prevent server-side crash environment errors
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
