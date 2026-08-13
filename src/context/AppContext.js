"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const AppContext = createContext();

const MASTER_CATALOG_DATABASE = [
  {
    id: "p1",
    name: "AcousticMax Pro ANC Wireless Headphones",
    nameAm: "አኮስቲክማክስ ፕሮ ሽቦ አልባ የጆሮ ማዳመጫ",
    nameAr: "سماعات أذن لاسلكية أكوستيك ماكس برو",
    brand: "AlphaSonic Labs",
    category: "Electronics",
    price: 25.0,
    discountPrice: null,
    isFeatured: true,
    sku: "MK-EL-HDP-092",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", "🎵", "🔋"],
    status: "In Stock",
  },
  {
    id: "p2",
    name: "M2 Ultra Pro Laptop 16-inch",
    nameAm: "ኤም2 አልትራ ፕሮ ላፕቶፕ 16-ኢንች",
    nameAr: "كمبيوتر محمول إم 2 أولترا برو 16 بوصة",
    brand: "Compute Core",
    category: "Electronics",
    price: 1250.0,
    discountPrice: null,
    isFeatured: false,
    sku: "MK-EL-LAP-402",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", "🖥️", "🎛️"],
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
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", "👕", "👔"],
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
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80", "👟", "🎒"],
    status: "In Stock",
  },
  {
    id: "p4",
    name: "Organic Arabica Coffee Beans (1KG Bag)",
    nameAm: "ኦርጋኒክ የአረቢካ ቡና ፍሬ (1 ኪሎ)",
    nameAr: "حبوب بن عربية عضوية (حقيبة 1 كجم)",
    brand: "HararGold",
    category: "Groceries",
    price: 12.5,
    discountPrice: null,
    isFeatured: true,
    sku: "MK-GR-COF-881",
    images: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80", "🌱", "📦"],
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
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80", "🥗", "🍯"],
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
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80", "💧", "🧪"],
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
    images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", "✨", "☀️"],
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
    images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", "🤖", "🏠"],
    status: "In Stock",
  },
  {
    id: "p10",
    name: "Ergonomic Memory Foam Orthopedic Pillow",
    brand: "RestEasy",
    nameAm: "ኤርጎኖሚክ የአንገትና ትራስ ማስታገሻ ትራስ",
    nameAr: "وسادة طبية ميموري فوم مريحة",
    category: "Household items",
    price: 8.3333333333,
    discountPrice: null,
    isFeatured: false,
    sku: "MK-HH-PIL-910",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80", "💤", "☁️"],
    status: "In Stock",
  },
  {
    id: "p11",
    name: "Titanium Sports Smartwatch v4",
    nameAm: "ቲታኒየም የስፖርት ስማርት ሰዓት v4",
    nameAr: "ساعة ذكية رياضية من التيتانيوم الإصدار 4",
    brand: "ChronoTech",
    category: "Accessories",
    price: 16.6666666667,
    discountPrice: null,
    isFeatured: true,
    sku: "MK-AC-WTC-711",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80", "🏃", "💓"],
    status: "Low Stock",
  },
  {
    id: "p12",
    name: "Classic Polarized Aviator Sunglasses",
    nameAm: "ክላሲክ ፖላራይዝድ የፀሐይ መነጽር",
    nameAr: "نظارات شمسية طيار كلاسيكية مستقطبة",
    brand: "VogueFit",
    category: "Accessories",
    price: 6.6666666667,
    discountPrice: null,
    isFeatured: true,
    sku: "MK-AC-SUN-712",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80", "☀️", "🏖️"],
    status: "In Stock",
  },
];

const CATALOG_IMAGES_BY_SKU = Object.fromEntries(
  MASTER_CATALOG_DATABASE.map((p) => [p.sku, p.images]),
);

const CATALOG_PRICING_BY_SKU = Object.fromEntries(
  MASTER_CATALOG_DATABASE.map((p) => [
    p.sku,
    { price: p.price, discountPrice: p.discountPrice },
  ]),
);

export const TARGET_REGIONS = [
  {
    name: "Nigeria",
    code: "NG",
    currency: "NGN",
    symbol: "₦",
    exchangeRate: 1500,
    baseFreight: 35.0,
    taxRate: 0.075,
    flag: "🇳🇬",
  },
  {
    name: "Kenya",
    code: "KE",
    currency: "KES",
    symbol: "KSh",
    exchangeRate: 130,
    baseFreight: 28.0,
    taxRate: 0.16,
    flag: "🇰🇪",
  },
  {
    name: "Ethiopia",
    code: "ET",
    currency: "ETB",
    symbol: "Br",
    exchangeRate: 120,
    baseFreight: 20.0,
    taxRate: 0.15,
    flag: "🇪🇹",
  },
  {
    name: "UAE",
    code: "AE",
    currency: "AED",
    symbol: "د.إ",
    exchangeRate: 3.67,
    baseFreight: 12.0,
    taxRate: 0.05,
    flag: "🇦🇪",
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    currency: "SAR",
    symbol: "ر.س",
    exchangeRate: 3.75,
    baseFreight: 22.0,
    taxRate: 0.15,
    flag: "🇸🇦",
  },
  {
    name: "Egypt",
    code: "EG",
    currency: "EGP",
    symbol: "ج.م",
    exchangeRate: 50,
    baseFreight: 30.0,
    taxRate: 0.14,
    flag: "🇪🇬",
  },
];

export function AppProvider({ children }) {
  const [products, setProducts] = useState(MASTER_CATALOG_DATABASE);

  // Backend may return older seed data (emoji-only images). Merge catalog
  // image arrays by SKU so real photos always win.
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const merged = (res.data || []).map((p) => {
          const catalogImages = CATALOG_IMAGES_BY_SKU[p.sku];
          const catalogPricing = CATALOG_PRICING_BY_SKU[p.sku];
          let next = catalogImages ? { ...p, images: catalogImages } : p;
          if (catalogPricing) next = { ...next, ...catalogPricing };
          return next;
        });
        setProducts(merged);
      })
      .catch(() => setProducts(MASTER_CATALOG_DATABASE));
  }, []);

  const [cart, setCart] = useState([]);
  const [activeRegion, setActiveRegion] = useState(TARGET_REGIONS[3]);
  const [user, setUser] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Load persisted data client-side only to avoid hydration mismatch
  useEffect(() => {
    const cachedCart = localStorage.getItem("MERKATO_CART");
    if (cachedCart) setCart(JSON.parse(cachedCart));

    const cachedRegion = localStorage.getItem("MERKATO_REGION");
    if (cachedRegion) setActiveRegion(JSON.parse(cachedRegion));

    const cachedUser = localStorage.getItem("MERKATO_USER");
    if (cachedUser) setUser(JSON.parse(cachedUser));

    const cachedWishlist = localStorage.getItem("MERKATO_WISHLIST");
    if (cachedWishlist) setWishlistIds(JSON.parse(cachedWishlist));
  }, []);

  // Pull backend wishlist once a logged-in user is resolved
  useEffect(() => {
    if (!user) return;
    api.get("/account")
      .then((res) => {
        const backendWishlist = res.data?.wishlist || [];
        setWishlistIds(backendWishlist.map((p) => String(p._id || p)));
      })
      .catch(() => {});
  }, [user]);

  const [orderHistory, setOrderHistory] = useState([]);

  const convertPrice = (usd) => {
    const rate = activeRegion?.exchangeRate || 1;
    return (usd || 0) * rate;
  };

  const formatPrice = (usd) => {
    const converted = convertPrice(usd);
    return `${activeRegion?.symbol || "$"}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const logoutUser = () => {
    setUser(null);
    setOrderHistory([]);
    setWishlistIds([]);
    syncCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("MERKATO_CART");
      localStorage.removeItem("MERKATO_REGION");
      localStorage.removeItem("MERKATO_TOKEN");
      localStorage.removeItem("MERKATO_USER");
      localStorage.removeItem("MERKATO_WISHLIST");
      window.location.href = "/auth/login";
    }
  };

  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_CART", JSON.stringify(updatedCart));
    }
  };

  const getProductId = (p) => String(p?._id || p?.id);

  const addToCart = (product) => {
    const id = getProductId(product);
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      updateCartQty(id, existing.quantity + 1);
    } else {
      syncCart([
        ...cart,
        {
          ...product,
          id,
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
      cart.map((item) =>
        item.id === String(id) ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    syncCart(cart.filter((item) => item.id !== String(id)));
  };

  const clearCart = () => syncCart([]);

  const syncWishlist = (nextIds) => {
    setWishlistIds(nextIds);
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_WISHLIST", JSON.stringify(nextIds));
    }
  };

  const toggleWishlist = async (productId) => {
    const id = String(productId);
    const saved = wishlistIds.includes(id);
    let nextIds = saved
      ? wishlistIds.filter((wid) => wid !== id)
      : [...wishlistIds, id];

    if (user) {
      try {
        const res = saved
          ? await api.delete(`/account/wishlist/${id}`)
          : await api.put("/account/wishlist", { productId: id });
        nextIds = (res.data || []).map((p) => String(p._id || p));
      } catch {
        // Persist optimistically locally even if the sync failed
      }
    }
    syncWishlist(nextIds);
  };

  const updateRegionSelection = (regionCode) => {
    const match = TARGET_REGIONS.find((r) => r.code === regionCode);
    if (!match) return;

    setActiveRegion(match);

    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_REGION", JSON.stringify(match));
    }

    const updatedCartPrices = cart.map((item) => {
      const baseProduct = products.find((p) => getProductId(p) === item.id);
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
        clearCart,
        activeRegion,
        updateRegionSelection,
        user,
        setUser,
        logoutUser,
        orderHistory,
        setOrderHistory,
        wishlistIds,
        toggleWishlist,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppEngine = () => useContext(AppContext);
