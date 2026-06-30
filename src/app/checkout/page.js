"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";

const PROMO_CODES_REGISTRY = {
  MERKATO20: 0.2,
  FESTIVAL30: 0.3,
};

export default function CheckoutPage() {
  const { cart, updateCartQty, removeFromCart, activeRegion, clearCart } =
    useAppEngine();
  const { t } = useTranslationEngine();

  const [consigneeName, setConsigneeName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [cityName, setCityName] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [activeDiscountRatio, setActiveDiscountRatio] = useState(0);
  const [promoMessage, setPromoMessage] = useState({
    text: "",
    isError: false,
  });
  const [paymentGateway, setPaymentGateway] = useState("stripe");
  const [activeTab, setActiveTab] = useState("international");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const itemsSubtotal = cart.reduce(
    (acc, item) => acc + (item.activePrice || item.price) * item.quantity,
    0,
  );
  const discountDeduction = itemsSubtotal * activeDiscountRatio;
  const regionalFreightCost =
    cart.length > 0 ? activeRegion?.baseFreight || 0 : 0;
  const computedRegionalTax =
    (itemsSubtotal - discountDeduction) * (activeRegion?.taxRate || 0);
  const grandTotalSummaryAmount =
    itemsSubtotal -
    discountDeduction +
    regionalFreightCost +
    computedRegionalTax;

  const handleValidatePromoCode = (e) => {
    e.preventDefault();
    const sanitizedToken = promoInput.trim().toUpperCase();

    if (PROMO_CODES_REGISTRY[sanitizedToken]) {
      setActiveDiscountRatio(PROMO_CODES_REGISTRY[sanitizedToken]);
      setPromoMessage({
        text: `✓ Code cleared! Deducting ${PROMO_CODES_REGISTRY[sanitizedToken] * 100}% off your base items subtotal.`,
        isError: false,
      });
    } else {
      setActiveDiscountRatio(0);
      setPromoMessage({
        text: "⚠️ Provided coupon tracking parameters do not match active campaigns.",
        isError: true,
      });
    }
  };

  // 📍 src/app/checkout/page.js ውስጥ handleCheckoutSubmission ፈንክሽንን በዚህ ይተኩት፡
  // 📍 src/app/checkout/page.js ውስጥ handleCheckoutSubmission ፈንክሽንን በዚህ ሙሉ በሙሉ ይተኩት፡
  const handleCheckoutSubmission = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!consigneeName || !contactPhone || !streetAddress || !cityName) {
      alert(
        "Please populate all mandatory shipping destination delivery parameters.",
      );
      return;
    }

    setIsProcessing(true);

    try {
      // ሰርቨሩ የደህንነት ፍተሻውን እስኪያጠናቅቅ ለ 2 ሰከንድ ይጠብቃል
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 📲 1. የቴሌብር መተግበሪያ ማዞሪያ (telebirr App Connection) [INDEX]
      if (paymentGateway === "telebirr") {
        alert("📱 Launching telebirr Mobile Application...");
        try {
          window.location.href = "telebirr://";
          setTimeout(() => {
            window.location.replace("https://ethiotelecom.et");
          }, 1500);
        } catch (e) {
          window.location.replace("https://ethiotelecom.et");
        }
        return;
      }

      // 📲 2. የኤም-ፔሳ መተግበሪያ ማዞሪያ (M-Pesa / Safaricom App Connection)
      if (paymentGateway === "mpesa") {
        alert("💸 Launching Safaricom M-Pesa Dynamic Application Gateways...");
        try {
          // በደንበኛው ስልክ ላይ ያለውን የ M-Pesa መተግበሪያ በቀጥታ ይቀሰቅሳል
          window.location.href = "mpesa://";

          // መተግበሪያው በስልኩ ላይ ካልተጫነ ለ 1.5 ሰከንድ ቆይቶ ወደ ሳፋሪኮም ድረ-ገጽ እንዲወስደው (Fallback)
          setTimeout(() => {
            window.location.replace("https://safaricom.co.ke");
          }, 1500);
        } catch (e) {
          window.location.replace("https://safaricom.co.ke");
        }
        return;
      }

      // 📲 3. የፔይፓል መተግበሪያ ማዞሪያ (PayPal App Connection)
      if (paymentGateway === "paypal") {
        alert("🅿️ Launching PayPal Secure Account Mobile Application...");
        try {
          // በደንበኛው ስልክ ላይ ያለውን የ PayPal መተግበሪያ በቀጥታ ይቀሰቅሳል
          window.location.href = "paypal://";

          // መተግበሪያው በስልኩ ላይ ካልተጫነ ለ 1.5 ሰከንድ ቆይቶ ወደ ፔይፓል ድረ-ገጽ እንዲወስደው (Fallback)
          setTimeout(() => {
            window.location.replace("https://paypal.com");
          }, 1500);
        } catch (e) {
          window.location.replace("https://paypal.com");
        }
        return;
      }

      // 💳 4. የስትራይፕ ዓለም አቀፍ ካርድ መክፈያ (Stripe Gateway Gate) [INDEX]
      if (paymentGateway === "stripe") {
        alert(
          "💳 Connecting to Secure Stripe Checkout Gateway Network Server...",
        );
        window.location.replace("https://stripe.com"); // የካርድ መረጃ በደህንነት ዌብሳይት ላይ ይሞላል [INDEX]
        return;
      }

      // የክፍያ አማራጭ ካልተመረጠ ትዕዛዙን በነባሪ ያጸድቃል [INDEX]
      setOrderConfirmation({
        trackingNumber: `MK-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        recipient: consigneeName,
        totalCharged: grandTotalSummaryAmount,
        destinationZone: activeRegion?.name || "Global Node",
        currencySymbol: activeRegion?.symbol || "$",
      });

      if (clearCart) clearCart();
    } catch (err) {
      alert("✕ Fulfillment payment pipeline network timeout error.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderConfirmation) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-100 animate-bounce">
          ✓
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Form Cleared Successfully
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Your payment parameters were authorized securely. A notification
            copy was logged.
          </p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl text-left text-xs font-semibold space-y-3 shadow-sm">
          <div className="flex justify-between font-mono text-gray-400">
            <span>Tracking Reference Code:</span>
            <span className="text-slate-900 font-bold">
              {orderConfirmation.trackingNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Consignee Account:</span>
            <span className="text-slate-900 font-bold">
              {orderConfirmation.recipient}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Distribution Node Zone:</span>
            <span className="text-slate-900 font-bold">
              {orderConfirmation.destinationZone}
            </span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between text-sm font-black">
            <span className="text-slate-900">Total Settlement Invoiced:</span>
            <span className="text-emerald-600">
              {orderConfirmation.currencySymbol}
              {orderConfirmation.totalCharged.toFixed(2)}
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="inline-block w-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-bold py-3.5 rounded-xl transition shadow-md"
        >
          Return to Marketplace Showcase Home Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800">
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight uppercase">
          Secure Transaction Node
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">
          Provide distribution parameters, select payment gateways, and finalize
          cross-border cargo clearance orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 font-mono">
              📦 Shopping Cart Basket Items ({cart.length})
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <span className="text-2xl block">📥</span>
                <p className="text-xs text-gray-400 font-medium">
                  Your shopping cart inventory queue matches zero entries.
                </p>
                <Link
                  href="/"
                  className="inline-block text-xs font-bold text-emerald-600 hover:underline"
                >
                  Return to Storefront Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-50">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 pt-4 first:pt-0 text-xs font-medium"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-3xl bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100">
                        {item.images?.[0] || "📦"}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-400 font-mono text-[10px] uppercase font-bold mt-0.5">
                          SKU: {item.sku || "MK-GEN-000"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(item.id, item.quantity - 1)
                          }
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded font-black text-slate-700"
                        >
                          -
                        </button>
                        <span className="font-bold font-mono text-slate-800 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(item.id, item.quantity + 1)
                          }
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded font-black text-slate-700"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-bold font-mono text-slate-950 min-w-15 text-right">
                        {activeRegion?.symbol || "$"}
                        {(
                          (item.activePrice || item.price) * item.quantity
                        ).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            id="checkout-core-form"
            onSubmit={handleCheckoutSubmission}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 font-mono">
              📋 Shipping Destination Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div className="space-y-1.5">
                <label className="text-gray-400">Consignee Full Name *</label>
                <input
                  type="text"
                  required
                  value={consigneeName}
                  onChange={(e) => setConsigneeName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-gray-400">Street Address *</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400">City / Township *</label>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
            </div>

            {/* 📍 Replace your old Payment Gateway Core div container with this exact snippet: */}
            <div className="pt-4 border-t border-gray-50 space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider block font-mono">
                Payment Gateway Core
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold font-mono uppercase">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("international");
                    setPaymentGateway("stripe");
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${activeTab === "international" ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                >
                  🌐 International Gateway
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("regional");
                    setPaymentGateway("telebirr");
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${activeTab === "regional" ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                >
                  🏦 Regional Mobile Banking Node
                </button>
              </div>
            </div>

            {/* 🌐 INTERNATIONAL DRAWER: Expands to show Stripe and PayPal options only */}
            {activeTab === "international" && (
              <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl mt-3 space-y-2 text-left animate-slideDown">
                <span className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">
                  Select Global Processing Gateway
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono font-black uppercase">
                  <button
                    type="button"
                    onClick={() => setPaymentGateway("stripe")}
                    className={`p-3 rounded-xl border text-center transition ${paymentGateway === "stripe" ? "bg-emerald-600 text-white border-transparent shadow" : "bg-white text-slate-700 border-gray-200"}`}
                  >
                    💳 Stripe (Card)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentGateway("paypal")}
                    className={`p-3 rounded-xl border text-center transition ${paymentGateway === "paypal" ? "bg-blue-600 text-white border-transparent shadow" : "bg-white text-slate-700 border-gray-200"}`}
                  >
                    🅿️ PayPal Core
                  </button>
                </div>
              </div>
            )}

            {/* 🏦 REGIONAL DRAWER: Expands to show telebirr and M-Pesa options only */}
            {/* 📍 src/app/checkout/page.js ውስጥ የሞባይል ክፍያ ቁልፎችን በዚህ ይተኩት፡ */}
            {activeTab === "regional" && (
              <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl mt-3 space-y-2 text-left">
                <span className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">
                  Select Mobile Banking Channel
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono font-black uppercase">
                  {/* 📱 1. ቴሌብር (telebirr) ቁልፍ */}
                  <button
                    type="button"
                    onClick={() => setPaymentGateway("telebirr")} // 👈 ✅ [FIXED]: ስቴቱን በትክክል 'telebirr' ያደርገዋል!
                    className={`p-3 rounded-xl border text-center transition ${paymentGateway === "telebirr" ? "bg-emerald-600 text-white border-transparent shadow" : "bg-white text-slate-700 border-gray-200"}`}
                  >
                    📱 telebirr
                  </button>

                  {/* 💸 2. ኤም-ፔሳ (M-Pesa) ቁልፍ */}
                  <button
                    type="button"
                    onClick={() => setPaymentGateway("mpesa")} // 👈 ✅ [FIXED]: ስቴቱን በትክክል 'mpesa' ያደርገዋል!
                    className={`p-3 rounded-xl border text-center transition ${paymentGateway === "mpesa" ? "bg-red-600 text-white border-transparent shadow" : "bg-white text-slate-700 border-gray-200"}`}
                  >
                    💸 M-Pesa
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono">
              Voucher Campaign Validator
            </h3>
            <form onSubmit={handleValidatePromoCode} className="flex gap-2">
              <input
                type="text"
                placeholder="E.G. MERKATO20"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 text-xs font-mono rounded-xl px-4 py-3 focus:outline-none tracking-wider font-bold uppercase"
              />
              <button
                type="submit"
                className="bg-[#0B1528] text-white text-xs font-black px-5 rounded-xl hover:bg-slate-800 transition"
              >
                Apply
              </button>
            </form>
            {promoMessage.text && (
              <p
                className={`text-[11px] font-bold leading-relaxed ${promoMessage.isError ? "text-red-500" : "text-emerald-600"}`}
              >
                {promoMessage.text}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono">
              Financial Clearance Ledger
            </h3>
            <div className="space-y-2.5 text-xs font-medium text-gray-500">
              <div className="flex justify-between">
                <span>Items Gross Subtotal:</span>
                <span className="font-mono text-slate-900 font-bold">
                  {activeRegion?.symbol || "$"}
                  {itemsSubtotal.toFixed(2)}
                </span>
              </div>
              {activeDiscountRatio > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Campaign Markdown Deduction:</span>
                  <span className="font-mono">
                    -{activeRegion?.symbol || "$"}
                    {discountDeduction.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cross-Border Freight Logistics:</span>
                <span className="font-mono text-slate-900 font-bold">
                  {activeRegion?.symbol || "$"}
                  {regionalFreightCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Regional Statutory Customs Tax (
                  {(activeRegion?.taxRate || 0) * 100}%):
                </span>
                <span className="font-mono text-slate-900 font-bold">
                  {activeRegion?.symbol || "$"}
                  {computedRegionalTax.toFixed(2)}
                </span>
              </div>
              <hr className="border-gray-50 pt-1" />
              <div className="flex justify-between text-sm font-black text-slate-900">
                <span>{t.totalEst || "Grand Total Amount:"}</span>
                <span className="font-mono text-emerald-600 text-base">
                  {activeRegion?.symbol || "$"}
                  {grandTotalSummaryAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-core-form"
              disabled={isProcessing || cart.length === 0}
              className={`w-full text-center block text-white font-black text-xs py-4 rounded-xl shadow mt-4 uppercase font-mono tracking-wider transition-all active:scale-98 ${
                isProcessing || cart.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isProcessing
                ? "Processing Secure Escrow Wire..."
                : t.checkoutBtn || "Finalize & Clear Cargo Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
