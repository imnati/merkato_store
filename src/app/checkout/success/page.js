"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useAppEngine();

  // Clear cart on successful payment
  useEffect(() => {
    if (clearCart) clearCart();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-100 animate-bounce">
        ✓
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-mono uppercase">
          Payment Successful
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Your order has been placed and payment confirmed via Stripe.
          Check your account for tracking details.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/account"
          className="w-full block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-4 rounded-xl transition shadow font-mono uppercase tracking-wider"
        >
          View My Orders
        </Link>
        <Link
          href="/"
          className="w-full block bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black py-4 rounded-xl transition shadow font-mono uppercase tracking-wider"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
