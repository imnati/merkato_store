import { cookies } from "next/headers";
import { MASTER_CATALOG_DATABASE, TARGET_REGIONS } from "@/context/AppContext";

export function createServerActionClient() {
  const cookieStore = cookies();
  const session = cookieStore.get("merkato_session");

  const products = MASTER_CATALOG_DATABASE;
  const activeRegion = TARGET_REGIONS[3];
  const user = {
    name: "Abebe Kebede",
    email: "abebe@merkato.com",
    role: session?.value === "active" ? "admin" : "customer",
    addresses: ["Dubai Marina, UAE", "Bole Sub-City, Addis Ababa, Ethiopia"],
  };

  const orderHistory = [];
  const setOrderHistory = () => {};
  const setProducts = (updater) => {
    if (typeof updater === "function") {
      const updated = updater(products);
      return updated;
    }
    return updater;
  };
  const setUser = () => {};

  return {
    products,
    setProducts,
    cart: [],
    addToCart: () => {},
    updateCartQty: () => {},
    removeFromCart: () => {},
    activeRegion,
    updateRegionSelection: () => {},
    user,
    setUser,
    orderHistory,
    setOrderHistory,
  };
}
