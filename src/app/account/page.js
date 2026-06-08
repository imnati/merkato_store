"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";

export default function AccountDashboardPage() {
  const { user, orderHistory, activeRegion } = useAppEngine();

  // Dashboard Tab Configuration: 'orders' | 'profile' | 'wishlist' | 'reviews'
  const [activeTab, setActiveTab] = useState("orders");

  // Interactive Form Component State Fields
  const [shippingAddresses, setShippingAddresses] = useState(
    user?.addresses || [
      "Bole Sub-City, Ward 03, House #451, Addis Ababa, Ethiopia",
      "Al Sukariya St, Villa 12, Dubai Marina, UAE",
    ],
  );
  const [newAddressInput, setNewAddressInput] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "w1",
      name: "M2 Ultra Pro Laptop 16-inch",
      brand: "Compute Core",
      price: 4500.0,
      img: "💻",
    },
    {
      id: "w2",
      name: "OLED Touch Display Smartphone",
      brand: "AlphaSonic Labs",
      price: 1200.0,
      img: "📱",
    },
  ]);

  // Handler Functions
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    setShippingAddresses([...shippingAddresses, newAddressInput.trim()]);
    setNewAddressInput("");
    alert("✓ Saved address list updated successfully.");
  };

  const handleRemoveAddress = (index) => {
    setShippingAddresses(shippingAddresses.filter((_, idx) => idx !== index));
  };

  const handleRemoveWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewMessage(
      `✓ Review processed! Added ${reviewRating}-star rating review to the item pipeline.`,
    );
    setReviewComment("");
  };

  // Fallback orders registry matching core MVP rules
  const activeOrdersQueue =
    orderHistory && orderHistory.length > 0
      ? orderHistory
      : [
          {
            id: "MK-ORD-884102",
            date: "2026-06-01",
            status: "In Transit",
            counter: 1,
            courier: "DHL Regional Freight Express",
            awb: "DHL-ET-99201",
            zone: "Addis Ababa Bole Terminal Wing",
            total: 323.5,
            item: "AcousticMax Pro ANC Headphones 🎧",
          },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800">
      {/* Profile Overview Header Card */}
      <div className="bg-[#0B1528] rounded-2xl p-6 text-white mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">
            Authenticated Customer Hub
          </span>
          <h1 className="text-xl font-black mt-1">
            {user?.name || "Abebe Kebede"}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            {user?.email || "abebe@merkato.com"} | Market:{" "}
            {activeRegion?.name || "Ethiopia"}
          </p>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-xl text-xs font-mono font-bold flex gap-4 text-slate-300">
          <div>
            In Transit:{" "}
            <span className="text-white font-black">
              {
                activeOrdersQueue.filter((o) => o.status === "In Transit")
                  .length
              }
            </span>
          </div>
          <div className="border-l border-slate-800"></div>
          <div>
            Wishlist:{" "}
            <span className="text-white font-black">
              {wishlistItems.length}
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
            className={`w-full text-left px-4 py-2.5 rounded-lg ${activeTab === "orders" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            📦 Track Shipments
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2.5 rounded-lg ${activeTab === "profile" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            👤 Profile & Addresses
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full text-left px-4 py-2.5 rounded-lg ${activeTab === "wishlist" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            ❤️ Saved Wishlist ({wishlistItems.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full text-left px-4 py-2.5 rounded-lg ${activeTab === "reviews" ? "bg-[#0B1528] text-white shadow-sm" : "hover:bg-gray-200"}`}
          >
            📝 Product Reviews
          </button>
        </nav>

        {/* Dynamic Display Layout Panel Container */}
        <main className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 min-h-[45vh]">
          {/* TAB 1: LOGISTICS PATH TRACKING */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                Fulfillment Tracking Logs
              </h3>
              {activeOrdersQueue.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50 text-xs font-semibold"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 bg-white p-3 rounded-lg border border-gray-100">
                    <div>
                      Tracking Ref:{" "}
                      <span className="text-slate-900 font-bold font-mono">
                        {order.id}
                      </span>
                    </div>
                    <div>
                      Date:{" "}
                      <span className="text-slate-700 font-mono">
                        {order.date}
                      </span>
                    </div>
                    <div>
                      Total Charged:{" "}
                      <span className="text-emerald-600 font-black font-mono">
                        {activeRegion?.symbol || "$"}
                        {order.total.toFixed(2)}
                      </span>
                    </div>
                    <span className="bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded border border-blue-100 uppercase text-[9px]">
                      {order.status}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <span>📦</span> {order.item}
                  </div>
                  <div className="bg-blue-50/40 border border-blue-100/50 p-3 rounded-lg text-slate-600 space-y-1 text-[10px]">
                    <p className="font-bold text-blue-900">
                      📡 Cargo Flight Path Telemetry:
                    </p>
                    <p>
                      Carrier Node: {order.courier} | Airway Bill: {order.awb}
                    </p>
                    <p>
                      Logistics Checkpoint:{" "}
                      <span className="text-emerald-700 font-bold">
                        {order.zone}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ADDRESS MATRIX CONTROL ARRAYS */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                Delivery Target Addresses
              </h3>
              <div className="space-y-2">
                {shippingAddresses.map((addr, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs font-semibold"
                  >
                    <p className="text-slate-700 truncate max-w-[80%]">
                      📍 {addr}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(index)}
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddAddress} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter custom delivery mapping line..."
                  value={newAddressInput}
                  onChange={(e) => setNewAddressInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-bold text-xs px-4 rounded-xl font-mono uppercase tracking-wide"
                >
                  Save
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WISHLIST BOOKMARKS FEED */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                Bookmarked Favorites Wishlist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-100 bg-gray-50/50 rounded-xl p-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl bg-white w-10 h-10 border rounded-lg flex items-center justify-center shadow-inner">
                        {item.img}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-400 text-[10px] font-mono">
                          {activeRegion?.symbol || "$"}
                          {item.price}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWishlist(item.id)}
                      className="text-gray-400 hover:text-red-500 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: POST-PURCHASE RATINGS REVIEWS FORM (🛠️ FIXED: የነበሩት ስህተቶች በሙሉ ተስተካክለዋል) */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                Submit Certified Review
              </h3>
              {reviewMessage && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-3 text-xs rounded-xl font-medium">
                  {reviewMessage}
                </div>
              )}

              <form
                onSubmit={handleReviewSubmit}
                className="space-y-4 text-xs font-semibold"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                    Fulfillment Target Product
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="AcousticMax Pro ANC Headphones (Ref: ORD-884102)"
                    className="w-full bg-gray-100 border border-gray-200 p-3 rounded-xl text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                    Assign Score Index
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-amber-500 font-extrabold cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value={5}>
                      ★★★★★ 5 / 5 — Superior Operational Excellence
                    </option>
                    <option value={4}>
                      ★★★★☆ 4 / 5 — Optimal Catalog Delivery
                    </option>
                    <option value={3}>★★★☆☆ 3 / 5 — Average Fulfillment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                    Evaluation Commentary
                  </label>
                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Provide product or freight metrics here..."
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-medium"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#0B1528] hover:bg-slate-800 text-white font-black text-xs py-4 rounded-xl font-mono uppercase tracking-wider shadow-md transition-all active:scale-[0.99]"
                  >
                    Dispatch Review
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
