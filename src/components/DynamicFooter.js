"use client";
import React from "react";
import Link from "next/link";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function DynamicFooter() {
  const { t } = useTranslationEngine();

  return (
    <footer className="bg-[#0B1528] text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 select-none">
              <span className="text-xl font-black font-mono tracking-tight">
                <span className="text-orange-500">MERKATO</span>{" "}
                <span className="text-white">STORE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
              {t?.footerTagline ||
                "Pan-African & Middle East marketplace — curated goods, secure freight, and regional commerce in one place."}
            </p>
            <div className="flex gap-1.5 pt-1">
              {["🇳🇬", "🇰🇪", "🇪🇹", "🇦🇪", "🇸🇦", "🇪🇬"].map((flag) => (
                <span
                  key={flag}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 border border-white/10 text-sm select-none"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white font-mono">
              Shop
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-slate-400">
              {["Electronics", "Fashion & Clothing", "Groceries", "Beauty", "Household", "Accessories"].map((c) => (
                <li key={c}>
                  <Link
                    href="/products"
                    className="hover:text-emerald-400 hover:underline transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white font-mono">
              Account
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-slate-400">
              <li>
                <Link href="/account" className="hover:text-emerald-400 hover:underline transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-400 hover:underline transition-colors">
                  Basket
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-emerald-400 hover:underline transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-emerald-400 hover:underline transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-emerald-400 hover:underline transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white font-mono">
              Support
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-slate-400">
              {[
                { label: "Track an Order", href: "/account" },
                { label: "Secure Payments", href: "/checkout" },
                { label: "Delivery & Freight", href: "/products" },
              ].map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="hover:text-emerald-400 hover:underline transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[11px] font-bold text-slate-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="truncate font-mono font-bold">
                {t?.supportCta || "support@merkato.store"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-medium text-slate-400">
          <p>
            © {new Date().getFullYear()} Merkato Store Marketplace — All
            multi-region routes secured.
          </p>
          <div className="flex items-center gap-4 font-mono uppercase tracking-wider">
            <span>Stripe Secure</span>
            <span>·</span>
            <span>6 Regional Hubs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}