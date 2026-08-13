"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppEngine } from "@/context/AppContext";
import api from "@/lib/axios";
import { useTranslationEngine } from "@/context/LanguageContext";
import ProductImage from "@/components/ProductImage";
import {
  BoxIcon,
  HeartIcon,
  PencilIcon,
  UserIcon,
  MapPinIcon,
  CloseIcon,
} from "@/components/Icons";

export default function AccountDashboardPage() {
  const { user, setUser, activeRegion, products, wishlistIds, toggleWishlist, addToCart, formatPrice } = useAppEngine();
  const { t } = useTranslationEngine();
  const router = useRouter();

  // Redirect unauthenticated users straight to login (no profile flash)
  useEffect(() => {
    const token = localStorage.getItem("MERKATO_TOKEN");
    if (!token) router.replace("/auth/login");
  }, [router]);

  const [activeTab, setActiveTab] = useState("orders");
  const [orderHistory, setOrderHistory] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState(user?.addresses || []);
  const [newAddressInput, setNewAddressInput] = useState("");

  // Fetch real orders on mount
  useEffect(() => {
    api.get("/orders/my")
      .then((res) => setOrderHistory(res.data))
      .catch(() => {});
  }, []);

  // Sync addresses from user
  useEffect(() => {
    if (user?.addresses) setShippingAddresses(user.addresses);
  }, [user]);

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewProduct, setReviewProduct] = useState(() =>
    (products || []).find((p) => p.name?.toLowerCase().includes("headphones")) ||
    products?.[0] ||
    null,
  );
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const reviewMatches = (
    (products || []).filter((p) => {
      if (!reviewSearch.trim()) return true;
      return [p.name, p.category, p.brand].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(reviewSearch.toLowerCase()),
      );
    })
  ).slice(0, 30);

  const wishlistProducts = (products || []).filter((p) =>
    wishlistIds.includes(String(p._id || p.id)),
  );

  // Handler Functions
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    const updated = [...shippingAddresses, newAddressInput.trim()];
    try {
      await api.put("/account", { addresses: updated });
      setShippingAddresses(updated);
      persistUserAddresses(updated);
      setNewAddressInput("");
    } catch {
      alert(t.failedSaveAddress);
    }
  };

  const handleRemoveAddress = async (index) => {
    const updated = shippingAddresses.filter((_, idx) => idx !== index);
    try {
      await api.put("/account", { addresses: updated });
      setShippingAddresses(updated);
      persistUserAddresses(updated);
    } catch {
      alert(t.failedSaveAddress);
    }
  };

  const persistUserAddresses = (updated) => {
    if (!user) return;
    const nextUser = { ...user, addresses: updated };
    setUser(nextUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("MERKATO_USER", JSON.stringify(nextUser));
    }
  };

  const handleRemoveWishlist = (productId) => {
    toggleWishlist(productId);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    if (!reviewProduct) {
      setReviewError(true);
      setReviewMessage(t.reviewSelectProduct);
      return;
    }

    try {
      await api.post("/reviews", {
        product: reviewProduct._id || reviewProduct.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewError(false);
      setReviewMessage(
        t.reviewSubmitted.replace("{n}", reviewRating),
      );
      setReviewComment("");
    } catch (err) {
      setReviewError(true);
      setReviewMessage(
        err.response?.data?.message || t.reviewFailed,
      );
    }
  };

  // Normalize real backend orders only (no fake demo data when empty)
  const STATUS_LABELS = {
    "Pending Payment": t.stAwaitingPayment,
    Processing: t.stPaidProcessing,
    "In Transit": t.stInTransit,
    "Delivered Complete": t.stDelivered,
    Cancelled: t.stCancelled,
    Refunded: t.stCancelled,
  };

  const activeOrdersQueue = (orderHistory || []).map((order) => ({
    id: order._id || order.id,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : order.date || "—",
    status: order.status || "Pending Payment",
    courier: order.courier || "Regional Air Freight",
    awb: order.awb || `AWB-${String(order._id || order.id).slice(-6)}`,
    zone: order.destination || order.zone || "Awaiting dispatch",
    total: order.total || 0,
    item:
      Array.isArray(order.items) && order.items.length > 0
        ? order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")
        : order.item || "Order placed",
  }));

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-sm space-y-4">
          <div className="h-24 rounded-2xl bg-slate-200/70 animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            <div className="h-16 col-span-1 rounded-xl bg-slate-200/70 animate-pulse" />
            <div className="h-16 col-span-3 rounded-xl bg-slate-200/70 animate-pulse" />
          </div>
          <div className="h-40 rounded-2xl bg-slate-200/70 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800">
      {/* Profile Overview Header Card */}
      <div className="bg-[#0B1528] rounded-2xl p-6 text-white mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">
            {t.myAccount}
          </span>
          <h1 className="text-xl font-black mt-1">
            {user?.name || "Abebe Kebede"}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            {user?.email || "abebe@merkato.com"} | {t.marketLabel}{" "}
            {activeRegion?.name || "Ethiopia"}
          </p>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-xl text-xs font-mono font-bold flex gap-4 text-slate-300">
          <div>
            {t.inTransitStat}{" "}
            <span className="text-white font-black">
              {
                activeOrdersQueue.filter((o) => o.status === "In Transit")
                  .length
              }
            </span>
          </div>
          <div className="border-l border-slate-800"></div>
          <div>
            {t.wishlistStat}{" "}
            <span className="text-white font-black">
              {wishlistIds.length}
            </span>
          </div>
        </div>
      </div>

      {/* Split Grid: Tab Selector vs Sub-Panel Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Selector Buttons Menu */}
        <nav className="flex overflow-x-auto lg:flex-col gap-1 bg-gray-100 p-1.5 rounded-xl text-xs font-bold text-gray-500 whitespace-nowrap">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-2 ${activeTab === "orders" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            <BoxIcon className="h-4 w-4" /> {t.tabOrders}
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-2 ${activeTab === "profile" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            <UserIcon className="h-4 w-4" /> {t.tabProfile}
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-2 ${activeTab === "wishlist" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            <HeartIcon className="h-4 w-4" /> {t.tabWishlist} ({wishlistIds.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-2 ${activeTab === "reviews" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            <PencilIcon className="h-4 w-4" /> {t.tabReviews}
          </button>
        </nav>

        {/* Dynamic Display Layout Panel Container */}
        <main className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 min-h-[45vh]">
          {/* TAB 1: LOGISTICS PATH TRACKING */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                {t.tabOrders}
              </h3>
              {activeOrdersQueue.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center space-y-2">
                  <span className="block mx-auto text-slate-300">
                    <BoxIcon className="h-10 w-10" />
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {t.noOrdersYet}
                  </p>
                  <Link
                    href="/"
                    className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {t.startShopping}
                  </Link>
                </div>
              ) : (
                activeOrdersQueue.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50 text-xs font-semibold"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 bg-white p-3 rounded-lg border border-gray-100">
                    <div>
                      {t.trackingRef}{" "}
                      <span className="text-slate-900 font-bold font-mono">
                        {order.id}
                      </span>
                    </div>
                    <div>
                      {t.dateLabel}{" "}
                      <span className="text-slate-700 font-mono">
                        {order.date}
                      </span>
                    </div>
                    <div>
                      {t.totalPaid}{" "}
                      <span className="text-emerald-600 font-black font-mono">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                    <span className="bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded border border-blue-100 uppercase text-[9px]">
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <BoxIcon className="h-4 w-4 shrink-0 text-gray-400" /> {order.item}
                  </div>
                  <div className="bg-blue-50/40 border border-blue-100/50 p-3 rounded-lg text-slate-600 space-y-1 text-[10px]">
                    <p className="font-bold text-blue-900">
                      {t.deliveryUpdates}
                    </p>
                    <p>
                      {t.shippingLabel} {order.courier} | {t.trackingNumber} {order.awb}
                    </p>
                    <p>
                      {t.destination}{" "}
                      <span className="text-emerald-700 font-bold">
                        {order.zone}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
            </div>
          )}

          {/* TAB 2: ADDRESS MATRIX CONTROL ARRAYS */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                {t.myAddresses}
              </h3>
              <div className="space-y-2">
                {shippingAddresses.map((addr, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs font-semibold"
                  >
                    <p className="text-slate-700 truncate max-w-[80%]">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-emerald-600" /> {addr}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(index)}
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      {t.remove}
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddAddress} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.addAddressPlaceholder}
                  value={newAddressInput}
                  onChange={(e) => setNewAddressInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-bold text-xs px-4 rounded-xl font-mono uppercase tracking-wide"
                >
                  {t.apply}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WISHLIST BOOKMARKS FEED */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                {t.myWishlist}
              </h3>
              {wishlistProducts.length === 0 ? (
                <p className="text-xs text-gray-400 font-medium bg-gray-50 border border-gray-100 rounded-xl p-4">
                  {t.wishlistEmpty}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
{wishlistProducts.map((product) => {
                    const pid = product._id || product.id;
                    return (
                      <div
                        key={pid}
                        className="border border-gray-100 bg-gray-50/50 rounded-xl p-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="bg-white w-10 h-10 border rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden">
                            <ProductImage
                              src={product.images?.[0] || "📦"}
                              alt={product.name}
                              emojiClassName="text-2xl"
                            />
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={`/products/detail/${pid}`}
                              className="font-bold text-slate-800 truncate block hover:text-emerald-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                            <p className="text-gray-400 text-[10px] font-mono">
                              {formatPrice(product.discountPrice || product.price || 0)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-black hover:bg-emerald-700 transition"
                          >
                            {t.addToCartShort}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveWishlist(pid)}
                            className="text-gray-400 hover:text-red-500 font-bold px-1"
                          >
                            <CloseIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: POST-PURCHASE RATINGS REVIEWS FORM (🛠️ FIXED: የነበሩት ስህተቶች በሙሉ ተስተካክለዋል) */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                {t.submitReview}
              </h3>
              {reviewMessage && (
                <div
                  className={`p-3 text-xs rounded-xl font-medium ${
                    reviewError
                      ? "bg-red-50 border-l-4 border-red-500 text-red-800"
                      : "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800"
                  }`}
                >
                  {reviewMessage}
                </div>
              )}

              <form
                onSubmit={handleReviewSubmit}
                className="space-y-4 text-xs font-semibold"
              >
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                    {t.productLabel}
                  </label>
                  <input
                    type="text"
                    value={reviewSearch}
                    onChange={(e) => {
                      setReviewSearch(e.target.value);
                      setReviewOpen(true);
                    }}
                    onFocus={() => setReviewOpen(true)}
                    onBlur={() => setReviewOpen(false)}
                    placeholder={
                      reviewProduct
                        ? reviewProduct.name
                        : t.searchProductPlaceholder
                    }
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-medium"
                  />
                  {reviewOpen && reviewMatches.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                      {reviewMatches.map((p) => {
                        const pid = String(p._id || p.id);
                        const isCurrent =
                          String(reviewProduct?._id || reviewProduct?.id) === pid;
                        return (
                          <button
                            key={pid}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setReviewProduct(p);
                              setReviewSearch("");
                              setReviewOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-xs font-medium transition-colors flex items-center justify-between gap-2 border-b border-gray-50 last:border-0 hover:bg-emerald-50 ${
                              isCurrent ? "bg-emerald-50" : ""
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {formatPrice(p.discountPrice || p.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {reviewSearch.trim() && reviewMatches.length === 0 && (
                    <p className="text-[10px] text-red-400 font-medium mt-1.5">
                      {t.noMatch} &quot;{reviewSearch}&quot;
                    </p>
                  )}
                </div>
{reviewProduct && (
                    <p className="text-[10px] text-slate-400 font-medium mt-1.5">
                      {t.selectedLabel}{" "}
                      <span className="text-emerald-600 font-bold">
                        {reviewProduct.name}
                      </span>
                    </p>
                  )}

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                    {t.yourRating}
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-amber-500 font-extrabold cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value={5}>{t.ratingExcellent}</option>
                    <option value={4}>{t.ratingGood}</option>
                    <option value={3}>{t.ratingAverage}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                    {t.yourReview}
                  </label>
                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t.writeReviewPlaceholder}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-medium"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#0B1528] hover:bg-slate-800 text-white font-black text-xs py-4 rounded-xl font-mono uppercase tracking-wider shadow-md transition-all active:scale-[0.99]"
                  >
                    {t.submitReviewCta}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
