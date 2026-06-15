"use client";

import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

const MASTER_CATALOG_DATABASE = [
  {
    id: "p1",
    name: "AcousticMax Pro ANC Wireless Headphones",
    nameAm: "አኮስቲክማክስ ፕሮ ሽቦ አልባ የጆሮ ማዳመጫ",
    nameAr: "سماعات أذن لاسلكية أكوستيك ماكس برو",
    brand: "AlphaSonic Labs",
    category: "Electronics",
    price: 349.0,
    discountPrice: 289.0,
    isFeatured: true,
    sku: "MK-EL-HDP-092",
    images: ["🎧", "🎵", "🔋"],
    status: "In Stock",
  },
  {
    id: "p2",
    name: "M2 Ultra Pro Laptop 16-inch",
    nameAm: "ኤም2 አልትራ ፕሮ ላፕቶፕ 16-ኢንች",
    nameAr: "كمبيوتر محمول إم 2 أولترا برو 16 بوصة",
    brand: "Compute Core",
    category: "Electronics",
    price: 4500.0,
    discountPrice: null,
    isFeatured: false,
    sku: "MK-EL-LAP-402",
    images: ["💻", "🖥️", "🎛️"],
    status: "Low Stock",
  },
  {
    id: "p3",
    name: "Classic Denim Lightweight Casual Jacket",
    nameAm: "ክላሲክ ዴኒም ቀላል ክብደት ጃኬት",
    nameAr: "جاكيت جينز كلاسيكي خفيف الوزن",
    brand: "VogueFit",
    category: "Fashion & clothing",
    price: 150.0,
    discountPrice: 120.0,
    isFeatured: true,
    sku: "MK-FA-JKT-103",
    images: ["🧥", "👕", "👔"],
    status: "In Stock",
  },
  {
    id: "p6",
    name: "Urban Streetwear Slim-Fit Cargo Pants",
    nameAm: "የከተማ ዘመናዊ ስሊም-ፊት ካርጎ ሱሪ",
    nameAr: "بنطال كارغو ضيق عصري",
    brand: "VogueFit",
    category: "Fashion & clothing",
    price: 95.0,
    discountPrice: 79.0,
    isFeatured: true,
    sku: "MK-FA-PNT-106",
    images: ["👖", "👟", "🎒"],
    status: "In Stock",
  },
  {
    id: "p4",
    name: "Organic Arabica Coffee Beans (1KG Bag)",
    nameAm: "ኦርጋኒክ የአረቢካ ቡና ፍሬ (1 ኪሎ)",
    nameAr: "حبوب بن عربية عضوية (حقيبة 1 كجم)",
    brand: "HararGold",
    category: "Groceries",
    price: 34.0,
    discountPrice: 29.5,
    isFeatured: true,
    sku: "MK-GR-COF-881",
    images: ["☕", "🌱", "📦"],
    status: "In Stock",
  },
  {
    id: "p7",
    name: "Premium Cold-Pressed Extra Virgin Olive Oil",
    nameAm: "ፕሪሚየም የወይራ ዘይት (Cold-Pressed)",
    nameAr: "زيت زيتون بكر ممتاز معصور على البارد",
    brand: "Mediterranean",
    category: "Groceries",
    price: 18.5,
    discountPrice: null,
    isFeatured: false,
    sku: "MK-GR-OIL-887",
    images: ["🍾", "🥗", "🍯"],
    status: "In Stock",
  },
  {
    id: "p5",
    name: "Hydrating Hyaluronic Acid Facial Serum",
    nameAm: "የፊት እርጥበት መጠበቂያ ሴረም (Serum)",
    nameAr: "سيروم الهያለሮኒክ لترطيب الوجه",
    brand: "GlowGlow",
    category: "Beauty products",
    price: 45.0,
    discountPrice: 38.0,
    isFeatured: true,
    sku: "MK-BT-SER-505",
    images: ["🧴", "💧", "🧪"],
    status: "Out of Stock",
  },
  {
    id: "p8",
    name: "Rejuvenating Vitamin C Brightening Cream",
    nameAm: "ቪታሚን ሲ የፊት ማሳመሪያ ክሬም",
    nameAr: "كريم تفتيح البشرة بفيتامين سي",
    brand: "GlowGlow",
    category: "Beauty products",
    price: 55.0,
    discountPrice: 49.0,
    isFeatured: true,
    sku: "MK-BT-CRM-508",
    images: ["🧴", "✨", "☀️"],
    status: "In Stock",
  },
  {
    id: "p9",
    name: "UltraClean Robotic Vacuum & Mop Console",
    nameAm: "አልትራክሊን ሮቦቲክ የቤት ማጽጃ ማሽን",
    nameAr: "مكنسة وممسحة روبوتية ألترا كلين",
    brand: "HomeBot",
    category: "Household items",
    price: 899.0,
    discountPrice: 749.0,
    isFeatured: true,
    sku: "MK-HH-VAC-909",
    images: ["🧹", "🤖", "🏠"],
    status: "In Stock",
  },
  {
    id: "p10",
    name: "Ergonomic Memory Foam Orthopedic Pillow",
    brand: "RestEasy",
    nameAm: "ኤርጎኖሚክ የአንገትና ትራስ ማስታገሻ ትራስ",
    nameAr: "وسادة طبية ميموري فوم مريحة",
    category: "Household items",
    price: 65.0,
    discountPrice: null,
    isFeatured: false,
    sku: "MK-HH-PIL-910",
    images: ["🛏️", "💤", "☁️"],
    status: "In Stock",
  },
  {
    id: "p11",
    name: "Titanium Sports Smartwatch v4",
    nameAm: "ቲታኒየም የስፖርት ስማርት ሰዓት v4",
    nameAr: "ساعة ذكية رياضية من التيتانيوم الإصدار 4",
    brand: "ChronoTech",
    category: "Accessories",
    price: 399.0,
    discountPrice: 345.0,
    isFeatured: true,
    sku: "MK-AC-WTC-711",
    images: ["⌚", "🏃", "💓"],
    status: "Low Stock",
  },
  {
    id: "p12",
    name: "Classic Polarized Aviator Sunglasses",
    nameAm: "ክላሲክ ፖላራይዝድ የፀሐይ መነጽር",
    nameAr: "نظارات شمسية طيار كلاسيكية مستقطبة",
    brand: "VogueFit",
    category: "Accessories",
    price: 110.0,
    discountPrice: 85.0,
    isFeatured: true,
    sku: "MK-AC-SUN-712",
    images: ["🕶️", "☀️", "🏖️"],
    status: "In Stock",
  },
];

export const TARGET_REGIONS = [
  {
    name: "Nigeria",
    code: "NG",
    currency: "NGN",
    symbol: "₦",
    baseFreight: 35.0,
    taxRate: 0.075,
    flag: "🇳🇬",
  },
  {
    name: "Kenya",
    code: "KE",
    currency: "KES",
    symbol: "KSh",
    baseFreight: 28.0,
    taxRate: 0.16,
    flag: "🇰🇪",
  },
  {
    name: "Ethiopia",
    code: "ET",
    currency: "ETB",
    symbol: "Br",
    baseFreight: 20.0,
    taxRate: 0.15,
    flag: "🇪🇹",
  },
  {
    name: "UAE",
    code: "AE",
    currency: "AED",
    symbol: "د.إ",
    baseFreight: 12.0,
    taxRate: 0.05,
    flag: "🇦🇪",
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    currency: "SAR",
    symbol: "ر.ስ",
    baseFreight: 22.0,
    taxRate: 0.15,
    flag: "🇸🇦",
  },
  {
    name: "Egypt",
    code: "EG",
    currency: "EGP",
    symbol: "ج.م",
    baseFreight: 30.0,
    taxRate: 0.14,
    flag: "🇪🇬",
  },
];

export function AppProvider({ children }) {
  const [products, setProducts] = useState(MASTER_CATALOG_DATABASE);

  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedCart = localStorage.getItem("MERKATO_CART");
      return cachedCart ? JSON.parse(cachedCart) : [];
    }
    return [];
  });

  const [activeRegion, setActiveRegion] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedRegion = localStorage.getItem("MERKATO_REGION");
      return cachedRegion ? JSON.parse(cachedRegion) : TARGET_REGIONS[3];
    }
    return TARGET_REGIONS[3];
  });

  const [user, setUser] = useState({
    name: "Abebe Kebede",
    email: "abebe@merkato.com",
    role: "admin",
    addresses: ["Dubai Marina, UAE", "Bole Sub-City, Addis Ababa, Ethiopia"],
  });

  const [orderHistory, setOrderHistory] = useState([]);

  const logoutUser = () => {
    setUser(null);
    setOrderHistory([]);
    syncCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("MERKATO_CART");
      localStorage.removeItem("MERKATO_REGION");
    }
    console.log("🔒 Session cleared cleanly.");
  };

  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_CART", JSON.stringify(updatedCart));
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      updateCartQty(product.id, existing.quantity + 1);
    } else {
      syncCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          activePrice: product.discountPrice || product.price,
        },
      ]);
    }
  };

  const updateCartQty = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    syncCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const removeFromCart = (id) => {
    syncCart(cart.filter((item) => item.id !== id));
  };

  const updateRegionSelection = (regionCode) => {
    const match = TARGET_REGIONS.find((r) => r.code === regionCode);
    if (!match) return;

    setActiveRegion(match);

    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_REGION", JSON.stringify(match));
    }

    const updatedCartPrices = cart.map((item) => {
      const baseProduct = products.find((p) => p.id === item.id);
      return {
        ...item,
        activePrice:
          baseProduct?.discountPrice || baseProduct?.price || item.activePrice,
      };
    });

    syncCart(updatedCartPrices);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        activeRegion,
        updateRegionSelection,
        user,
        setUser,
        logoutUser,
        orderHistory,
        setOrderHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppEngine = () => useContext(AppContext);
