"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

const AppContext = createContext(null);

const MASTER_CATALOG_DATABASE = [
  {
    id: "p1",
    name: "AcousticMax Pro ANC Wireless Headphones",
    nameAm: "አኮስቲክማክስ ፕሮ ሽቦ አልባ የጆሮ ማዳመጫ",
    nameAr: "سماعات أذن لاسلكية أكوستيك ماكس برو",
    description: "Premium noise-canceling headphones with deep bass.",
    brand: "AlphaSonic Labs",
    category: "Electronics",
    subcategory: "Audio",
    price: 349.0,
    discountPrice: 289.0,
    stockQuantity: 45,
    rating: 4.8,
    reviews: 120,
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
    description: "High-performance laptop for professionals.",
    brand: "Compute Core",
    category: "Electronics",
    subcategory: "Computers",
    price: 4500.0,
    discountPrice: null,
    stockQuantity: 5,
    rating: 4.9,
    reviews: 85,
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
    description: "Stylish everyday denim jacket.",
    brand: "VogueFit",
    category: "Fashion & clothing",
    subcategory: "Outerwear",
    price: 150.0,
    discountPrice: 120.0,
    stockQuantity: 30,
    rating: 4.5,
    reviews: 200,
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
    description: "Modern cargo pants with utility pockets.",
    brand: "VogueFit",
    category: "Fashion & clothing",
    subcategory: "Bottoms",
    price: 95.0,
    discountPrice: 79.0,
    stockQuantity: 25,
    rating: 4.4,
    reviews: 150,
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
    description: "Premium organic beans from Ethiopia.",
    brand: "HararGold",
    category: "Groceries",
    subcategory: "Beverages",
    price: 34.0,
    discountPrice: 29.5,
    stockQuantity: 100,
    rating: 4.9,
    reviews: 500,
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
    description: "Extra virgin cold-pressed olive oil.",
    brand: "Mediterranean",
    category: "Groceries",
    subcategory: "Pantry",
    price: 18.5,
    discountPrice: null,
    stockQuantity: 60,
    rating: 4.7,
    reviews: 300,
    isFeatured: false,
    sku: "MK-GR-OIL-887",
    images: ["🍾", "🥗", "🍯"],
    status: "In Stock",
  },
  {
    id: "p5",
    name: "Hydrating Hyaluronic Acid Facial Serum",
    nameAm: "የፊት እርጥበት መጠበቂያ ሴረም (Serum)",
    nameAr: "سيروم الهያለሮنيክ لترطيب الوجه",
    description: "Deep hydration serum for glowing skin.",
    brand: "GlowGlow",
    category: "Beauty products",
    subcategory: "Skincare",
    price: 45.0,
    discountPrice: 38.0,
    stockQuantity: 0,
    rating: 4.6,
    reviews: 400,
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
    description: "Brightening cream for radiant complexion.",
    brand: "GlowGlow",
    category: "Beauty products",
    subcategory: "Skincare",
    price: 55.0,
    discountPrice: 49.0,
    stockQuantity: 40,
    rating: 4.7,
    reviews: 250,
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
    description: "Smart robotic cleaner for your home.",
    brand: "HomeBot",
    category: "Household items",
    subcategory: "Appliances",
    price: 899.0,
    discountPrice: 749.0,
    stockQuantity: 10,
    rating: 4.8,
    reviews: 95,
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
    description: "Orthopedic support for better sleep.",
    category: "Household items",
    subcategory: "Bedding",
    price: 65.0,
    discountPrice: null,
    stockQuantity: 50,
    rating: 4.5,
    reviews: 180,
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
    description: "Lightweight titanium sports watch.",
    brand: "ChronoTech",
    category: "Accessories",
    subcategory: "Wearables",
    price: 399.0,
    discountPrice: 345.0,
    stockQuantity: 12,
    rating: 4.7,
    reviews: 110,
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
    description: "Timeless aviator design with UV protection.",
    brand: "VogueFit",
    category: "Accessories",
    subcategory: "Eyewear",
    price: 110.0,
    discountPrice: 85.0,
    stockQuantity: 75,
    rating: 4.6,
    reviews: 220,
    isFeatured: true,
    sku: "MK-AC-SUN-712",
    images: ["🕶️", "☀️", "🏖️"],
    status: "In Stock",
  },
];

export const TARGET_REGIONS = [
  {
    name: "USA",
    code: "US",
    currency: "USD",
    symbol: "$",
    baseFreight: 0.0,
    taxRate: 0.08,
    flag: "🇺🇸",
  },
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
  // ✅ FIX 1: Lazy-loads initial product stack safely from localStorage to survive reloads [INDEX]
  const [products, setProducts] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("MERKATO_STORE_CATALOG");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return MASTER_CATALOG_DATABASE;
        }
      }
    }
    return MASTER_CATALOG_DATABASE;
  });

  const [cart, setCart] = useState([]);
  const [activeRegion, setActiveRegion] = useState(TARGET_REGIONS[3]);

  // ✅ FIX 2: Watches products changes and writes them directly to storage instantly [INDEX]
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_STORE_CATALOG", JSON.stringify(products));
    }
  }, [products]);

  const updateRegionSelection = (regionCode) => {
    const newRegion = TARGET_REGIONS.find((r) => r.code === regionCode);
    if (newRegion) setActiveRegion(newRegion);
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty < product.stockQuantity) {
      if (existing) {
        updateCartQty(product.id, existing.quantity + 1);
      } else {
        setCart([
          ...cart,
          {
            ...product,
            quantity: 1,
            activePrice: product.discountPrice || product.price,
          },
        ]);
      }
    }
  };

  const updateCartQty = (id, quantity) => {
    const product = products.find((p) => p.id === id);
    if (!product || quantity > product.stockQuantity) return;
    if (quantity <= 0) setCart(cart.filter((item) => item.id !== id));
    else
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const contextValue = useMemo(
    () => ({
      products,
      setProducts,
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      activeRegion,
      setActiveRegion,
      updateRegionSelection,
    }),
    [products, cart, activeRegion],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppEngine = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppEngine must be used within an AppProvider");
  }
  return context;
};
