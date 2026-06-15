"use client";
import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const DICTIONARY = {
  en: {
    dir: "ltr",
    lang: "en",
    brandNamePart1: "MERKATO",
    brandNamePart2: "STORE",
    subtitle: "Pan-African & Middle East Marketplace",
    searchPlaceholder: "Search 5,000+ regional products...",
    btnCart: "Add to Cart",
    basketTitle: "Basket Summary",
    basketEmpty: "Basket is empty.",
    totalEst: "Estimated Total",
    checkoutBtn: "Proceed to Checkout",

    allProducts: "ALL PRODUCTS",
    electronics: "ELECTRONICS",
    fashion: "FASHION & CLOTHING",
    groceries: "GROCERIES",
    beauty: "BEAUTY PRODUCTS",
    household: "HOUSEHOLD ITEMS",
    accessories: "ACCESSORIES",

    deliverTo: "DELIVER TO",
    dashboard: "Dashboard",
    adminBadge: "ADMIN",
    logout: "Logout",
    signIn: "SIGN IN",
    signUp: "SIGN UP",
    forgotPassword: "Forgot Password?",

    footerCopy:
      "© 2026 Merkato Store Marketplace Hub. All multi-region routes secured via PCI-DSS Level 1 specifications.",
    footerSecurity: "TLS 1.3 Secure Deployment Pipeline",
  },
  ar: {
    dir: "rtl",
    lang: "ar",
    brandNamePart1: "ميركاتو",
    brandNamePart2: "متجر",
    subtitle: "التجارة الإلكترونية عبر أفريقيا والشرق الأوسط",
    searchPlaceholder: "ابحث في أكثر من ٥,٠٠٠ منتج...",
    btnCart: "أضف إلى السلة",
    basketTitle: "ملخص سلة التسوق",
    basketEmpty: "السلة فارغة.",
    totalEst: "الإجمالي التقديري",
    checkoutBtn: "المتابعة لإتمام الشراء",

    allProducts: "جميع المنتجات",
    electronics: "الإلكترونيات",
    fashion: "الأزياء والملابس",
    groceries: "البقالة",
    beauty: "منتجات التجميل",
    household: "المستلزمات المنزلية",
    accessories: "الإكسسوارات",

    deliverTo: "يتم الشحن إلى",
    dashboard: "لوحة التحكم",
    adminBadge: "مسؤول",
    logout: "تسجيل الخروج",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    forgotPassword: "هل نسيت كلمة المرور؟",

    footerCopy:
      "© ٢٠٢٦ مركز سوق متجر ميركاتو. جميع المسارات متعددة المناطق مؤمنة وفقًا لمواصفات PCI-DSS من المستوى ١.",
    footerSecurity: "قناة النشر الآمنة TLS 1.3",
  },
  am: {
    dir: "ltr",
    lang: "am",
    brandNamePart1: "መርካቶ",
    brandNamePart2: "ሱቅ",
    subtitle: "የአፍሪካ እና የመካከለኛው ምስራቅ የገበያ አዳራሽ",
    searchPlaceholder: "ከ5,000 በላይ እቃዎችን እዚህ ይፈልጉ...",
    btnCart: "ወደ ቅርጫት ጨምር",
    basketTitle: "የቅርጫት ማጠቃለያ",
    basketEmpty: "ቅርጫትዎ ባዶ ነው።",
    totalEst: "አጠቃላይ ድምር ዋጋ",
    checkoutBtn: "ወደ ክፍያ ሂድ",

    allProducts: "ሁሉንም ምርቶች",
    electronics: "ኤሌክትሮኒክስ",
    fashion: "አልባሳትና ፋሽን",
    groceries: "ግሮሰሪና ሸቀጣሸቀጥ",
    beauty: "የውበት መጠበቂያዎች",
    household: "የቤት ውስጥ ቁሶች",
    accessories: "አክሰሰሪዎች",

    deliverTo: "የሚላከው ወደ",
    dashboard: "ዳሽቦርድ",
    adminBadge: "አስተዳዳሪ",
    logout: "ውጣ",
    signIn: "ግባ",
    signUp: "ተመዝገብ",
    forgotPassword: "የይለፍ ቃል ረስተዋል?",

    footerCopy:
      "© 2026 መርካቶ ስቶር የገበያ ማዕከል። ሁሉም ክልላዊ የጉዞ መስመሮች በPCI-DSS ደረጃ 1 መግለጫዎች የተጠበቁ ናቸው。",
    footerSecurity: "TLS 1.3 ደህንነቱ የተጠበቀ የዝርጋታ መስመር",
  },
  fr: {
    dir: "ltr",
    lang: "fr",
    brandNamePart1: "MERKATO",
    brandNamePart2: "BOUTIQUE",
    subtitle: "Marché Panafricain & Moyen-Orient",
    searchPlaceholder: "Rechercher parmi plus de 5 000 produits...",
    btnCart: "Ajouter au Panier",
    basketTitle: "Résumé du Panier",
    basketEmpty: "Le panier est vide.",
    totalEst: "Total Estimé",
    checkoutBtn: "Passer à la Caisse",

    allProducts: "TOUS LES PRODUITS",
    electronics: "ÉLECTRONIQUE",
    fashion: "MODE & VÊTEMENTS",
    groceries: "ÉPICERIE",
    beauty: "PRODUITS DE BEAUTÉ",
    household: "ARTICLES MÉNAGERS",
    accessories: "ACCESSOIRES",

    deliverTo: "LIVRER À",
    dashboard: "Tableau de bord",
    adminBadge: "ADMIN",
    logout: "Déconnexion",
    signIn: "SE CONNECTER",
    signUp: "S'INSCRIRE",
    forgotPassword: "Mot de passe oublié?",

    footerCopy:
      "© 2026 Hub de marché Merkato Store. Toutes les routes sécurisées via les spécifications PCI-DSS Niveau 1.",
    footerSecurity: "Pipeline de Déploiement Sécurisé TLS 1.3",
  },
  es: {
    dir: "ltr",
    lang: "es",
    brandNamePart1: "MERKATO",
    brandNamePart2: "TIENDA",
    subtitle: "Mercado Panafricano y Medio Oriente",
    searchPlaceholder: "Buscar más de 5.000 productos...",
    btnCart: "Añadir al Carrito",
    basketTitle: "Resumen de la Cesta",
    basketEmpty: "El carrito está vacío.",
    totalEst: "Total Estimado",
    checkoutBtn: "Proceder al Pago",

    allProducts: "TODOS LOS PRODUCTOS",
    electronics: "ELECTRÓNICA",
    fashion: "ROPA Y MODA",
    groceries: "COMESTIBLES",
    beauty: "PRODUCTOS DE BELLEZA",
    household: "ARTÍCULOS DEL HOGAR",
    accessories: "ACCESORIOS",

    deliverTo: "ENVIAR A",
    dashboard: "Panel de control",
    adminBadge: "ADMIN",
    logout: "Cerrar sesión",
    signIn: "INICIAR SESIÓN",
    signUp: "REGISTRARSE",
    forgotPassword: "¿Olvidaste tu contraseña?",

    footerCopy:
      "© 2026 Centro de mercado Merkato Store. Rutas seguras mediante especificaciones PCI-DSS Nivel 1.",
    footerSecurity: "Canal de Implementación Seguro TLS 1.3",
  },
  pt: {
    dir: "ltr",
    lang: "pt",
    brandNamePart1: "MERKATO",
    brandNamePart2: "LOJA",
    subtitle: "Mercado Panafricano e Médio Oriente",
    searchPlaceholder: "Buscar mais de 5.000 produtos...",
    btnCart: "Adicionar ao Carrinho",
    basketTitle: "Resumo do Carrinho",
    basketEmpty: "O carrinho está vazio.",
    totalEst: "Total Estimé",
    checkoutBtn: "Prosseguir para o Pagamento",

    allProducts: "TODOS OS PRODUTOS",
    electronics: "ELETRÔNICOS",
    fashion: "MODA & VESTUÁRIO",
    groceries: "MERCEARIA",
    beauty: "PRODUITS DE BEAUTÉ",
    household: "UTENSÍLIOS DOMÉSTICOS",
    accessories: "ACESSÓRIOS",

    deliverTo: "ENVIAR PARA",
    dashboard: "Painel",
    adminBadge: "ADMIN",
    logout: "Sair",
    signIn: "ENTRAR",
    signUp: "CADASTRAR-SE",
    forgotPassword: "Esqueceu a senha?",

    footerCopy:
      "© 2026 Hub de mercado Merkato Store. Rotas seguras por meio das especificações PCI-DSS Nível 1.",
    footerSecurity: "Pipeline de Implantação Seguro TLS 1.3",
  },
  sw: {
    dir: "ltr",
    lang: "sw",
    brandNamePart1: "MERKATO",
    brandNamePart2: "DUKA",
    subtitle: "Soko la Pan-African & Mashariki ya Kati",
    searchPlaceholder: "Tafuta bidhaa 5,000+ za kikanda...",
    btnCart: "Weka Kwenye Kikapu",
    basketTitle: "Muhtasari wa Kikapu",
    basketEmpty: "Kikapu kiko tupu.",
    totalEst: "Jumla Inayokadiriwa",
    checkoutBtn: "Endelea Kwenye Malipo",

    allProducts: "BIDHAA ZOTE",
    electronics: "ELEKTRONIKI",
    fashion: "MAVAZI NA MITINDO",
    groceries: "BIDHAA ZA CHAKULA",
    beauty: "BIDHAA ZA UREMBO",
    household: "VIFAA VYA NYUMBANI",
    accessories: "VIFAA VYA ZIADA",

    deliverTo: "WELEKEZA KWA",
    dashboard: "Dashboard",
    adminBadge: "ADMIN",
    logout: "Ondoka",
    signIn: "INGIA",
    signUp: "JISAJILI",
    forgotPassword: "Umesahau Nywila?",

    footerCopy:
      "© 2026 Kitovu cha Soko la Merkato Store. Njia zote zimeidhinishwa kupitia maelezo ya PCI-DSS Ngazi ya 1.",
    footerSecurity: "TLS 1.3 Njia Salama ya Upelekaji",
  },
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedLocale = localStorage.getItem("MERKATO_LOCALE");
      return cachedLocale && DICTIONARY[cachedLocale] ? cachedLocale : "en";
    }
    return "en";
  });

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
      value={{ locale, t: DICTIONARY[locale] || DICTIONARY.en, switchLanguage }}
    >
      <div
        dir={DICTIONARY[locale]?.dir || "ltr"}
        suppressHydrationWarning={true}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useTranslationEngine = () => useContext(LanguageContext);
