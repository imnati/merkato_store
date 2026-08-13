"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import ProductImage from "@/components/ProductImage";
import { ClipboardIcon, CloseIcon, CartIcon, InboxIcon } from "@/components/Icons";
import api from "@/lib/axios";

const PROMO_CODES_REGISTRY = {
  MERKATO20: 0.2,
  FESTIVAL30: 0.3,
};

export default function CheckoutPage() {
  const { cart, updateCartQty, removeFromCart, activeRegion, formatPrice } =
    useAppEngine();
  const { t } = useTranslationEngine();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("MERKATO_TOKEN");
    if (!token) router.replace("/auth/login");
  }, [router]);

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
  const [isProcessing, setIsProcessing] = useState(false);

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
        text: t.promoApplied.replace("{n}", PROMO_CODES_REGISTRY[sanitizedToken] * 100),
        isError: false,
      });
    } else {
      setActiveDiscountRatio(0);
      setPromoMessage({
        text: t.promoInvalid,
        isError: true,
      });
    }
  };

  const handleCheckoutSubmission = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!consigneeName || !contactPhone || !streetAddress || !cityName) {
      alert(t.fillShipping);
      return;
    }
    setIsProcessing(true);
    try {
      const rate = activeRegion?.exchangeRate || 1;
      const currency = activeRegion?.currency || "USD";
      const { data } = await api.post("/payment/stripe/create-session", {
        items: [
          ...cart.map((item) => ({
            product: item._id || item.id,
            name: item.name,
            price: (item.activePrice || item.price) * rate,
            quantity: item.quantity,
          })),
          ...(regionalFreightCost > 0 ? [{
            product: null,
            name: "Shipping (freight)",
            price: regionalFreightCost * rate,
            quantity: 1,
          }] : []),
          ...(computedRegionalTax > 0 ? [{
            product: null,
            name: `Tax (${(activeRegion?.taxRate || 0) * 100}%)`,
            price: parseFloat((computedRegionalTax * rate).toFixed(2)),
            quantity: 1,
          }] : []),
          ...(discountDeduction > 0 ? [{
            product: null,
            name: `Discount (${activeDiscountRatio * 100}% off)`,
            price: -parseFloat((discountDeduction * rate).toFixed(2)),
            quantity: 1,
          }] : []),
        ],
        currency,
        exchangeRate: rate,
        destination: `${streetAddress}, ${cityName}, ${activeRegion?.name}`,
        courier: "Regional Freight",
        discountRatio: activeDiscountRatio,
      });
      // Redirect to Stripe hosted checkout page
      window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.message || t.paymentFailed);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800">
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight uppercase">
          {t.secureCheckout}
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">
          {t.checkoutSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 font-mono">
              <CartIcon className="h-4 w-4 text-slate-400" /> {t.yourOrder} ({cart.length})
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <span className="block mx-auto text-gray-300">
                  <InboxIcon className="h-9 w-9" />
                </span>
                <p className="text-xs text-gray-400 font-medium">
                  {t.cartEmpty}
                </p>
                <Link
                  href="/"
                  className="inline-block text-xs font-bold text-emerald-600 hover:underline"
                >
                  {t.returnToStore}
                </Link>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-50">
                {cart.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="flex items-center justify-between gap-4 pt-4 first:pt-0 text-xs font-medium"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 relative overflow-hidden">
                        <ProductImage
                          src={item.images?.[0] || "📦"}
                          alt={item.name}
                          emojiClassName="text-3xl"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-400 font-mono text-[10px] uppercase font-bold mt-0.5">
                          {t.skuLabel} {item.sku || "MK-GEN-000"}
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
                        {formatPrice(
                          (item.activePrice || item.price) * item.quantity,
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                      >
                        <CloseIcon className="h-4 w-4" />
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
              <ClipboardIcon className="h-4 w-4 text-slate-400" /> {t.shippingDetails}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div className="space-y-1.5">
                <label className="text-gray-400">{t.fullName}</label>
                <input
                  type="text"
                  required
                  value={consigneeName}
                  onChange={(e) => setConsigneeName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400">{t.phone}</label>
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
                <label className="text-gray-400">{t.street}</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400">{t.city}</label>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono">
              {t.promoCode}
            </h3>            <form onSubmit={handleValidatePromoCode} className="flex gap-2">
              <input
                type="text"
                placeholder={t.promoPlaceholder}
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 text-xs font-mono rounded-xl px-4 py-3 focus:outline-none tracking-wider font-bold uppercase"
              />
              <button
                type="submit"
                className="bg-[#0B1528] text-white text-xs font-black px-5 rounded-xl hover:bg-slate-800 transition"
              >
                {t.apply}
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
              {t.orderSummary}
            </h3>
            <div className="space-y-2.5 text-xs font-medium text-gray-500">
              <div className="flex justify-between">
                <span>{t.itemsSubtotal}</span>
                <span className="font-mono text-slate-900 font-bold">
                  {formatPrice(itemsSubtotal)}
                </span>
              </div>
              {activeDiscountRatio > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t.discountLabel}</span>
                  <span className="font-mono">
                    -{formatPrice(discountDeduction)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.shippingLabel}</span>
                <span className="font-mono text-slate-900 font-bold">
                  {formatPrice(regionalFreightCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  {t.taxLabel.replace("{n}", (activeRegion?.taxRate || 0) * 100)}
                </span>
                <span className="font-mono text-slate-900 font-bold">
                  {formatPrice(computedRegionalTax)}
                </span>
              </div>
              <hr className="border-gray-50 pt-1" />
              <div className="flex justify-between text-sm font-black text-slate-900">
                <span>{t.totalEst || "Total:"}</span>
                <span className="font-mono text-emerald-600 text-base">
                  {formatPrice(grandTotalSummaryAmount)}
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
                ? t.processingPayment
                : t.checkoutBtn || t.payNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
