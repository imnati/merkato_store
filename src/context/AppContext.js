"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { productApi } from "@/lib/api";

const AppContext = createContext();

const TARGET_REGIONS = [
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
    baseFreight: 22.0,
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
    symbol: "ر.س",
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [activeRegion, setActiveRegion] = useState(TARGET_REGIONS[3]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedUser = localStorage.getItem("MERKATO_USER");
      const cachedToken = localStorage.getItem("MERKATO_TOKEN");
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {}
      }
      if (cachedToken) {
        setToken(cachedToken);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedCart = localStorage.getItem("MERKATO_CART");
      if (cachedCart) {
        try {
          setCart(JSON.parse(cachedCart));
        } catch {}
      }
      const cachedRegion = localStorage.getItem("MERKATO_REGION");
      if (cachedRegion) {
        try {
          const parsed = JSON.parse(cachedRegion);
          const match = TARGET_REGIONS.find((r) => r.code === parsed.code);
          if (match) setActiveRegion(match);
        } catch {}
      }
      const cachedWishlist = localStorage.getItem("MERKATO_WISHLIST");
      if (cachedWishlist) {
        try {
          setWishlist(JSON.parse(cachedWishlist));
        } catch {}
      }
    }
  }, []);

  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_CART", JSON.stringify(updatedCart));
    }
  };

  const syncWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_WISHLIST", JSON.stringify(updatedWishlist));
    }
  };

  const addToWishlist = (product) => {
    const existing = wishlist.find((item) => item.id === product.id);
    if (!existing) {
      syncWishlist([
        ...wishlist,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.discountPrice || product.price,
          img: product.images?.[0] || "",
        },
      ]);
    }
  };

  const removeFromWishlist = (id) => {
    syncWishlist(wishlist.filter((item) => item.id !== id));
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
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

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_USER", JSON.stringify(userData));
      localStorage.setItem("MERKATO_TOKEN", authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("MERKATO_USER");
      localStorage.removeItem("MERKATO_TOKEN");
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        loading,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        activeRegion,
        updateRegionSelection,
        user,
        setUser,
        token,
        login,
        logout,
        isAuthenticated: !!user?.email,
        orderHistory,
        setOrderHistory,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppEngine = () => useContext(AppContext);

export { TARGET_REGIONS };
