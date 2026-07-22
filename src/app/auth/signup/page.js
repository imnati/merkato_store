"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslationEngine } from "@/context/LanguageContext";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [identityEmail, setIdentityEmail] = useState("");
  const [securePassword, setSecurePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [targetMarketRegion, setTargetMarketRegion] = useState("AE");
  const [adminCode, setAdminCode] = useState("");

  const [errorStatus, setErrorStatus] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const { t } = useTranslationEngine();
  const currentT = t || {};

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setErrorStatus("");
    setIsProvisioning(true);
    if (securePassword !== confirmPassword) {
      setErrorStatus("Passwords do not match.");
      setIsProvisioning(false);
      return;
    }
    try {
      await import("@/lib/axios").then((m) =>
        m.default.post("/auth/register", {
          name: fullName,
          email: identityEmail,
          password: securePassword,
          region: targetMarketRegion,
          adminCode,
        })
      );
      setSuccessStatus(true);
    } catch (err) {
      setErrorStatus(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsProvisioning(false);
    }
  };

  if (successStatus) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-100">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-mono uppercase">
              Account Created
            </h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Your account has been created successfully. You can now log in.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-block w-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl transition shadow-md text-center"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 space-y-6 transition-all">
        <div className="text-center space-y-1">
          <h2
            suppressHydrationWarning={true}
            className="text-2xl font-black font-mono tracking-tight text-slate-900 uppercase"
          >
            {currentT?.signUp || "Create Account"}
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Fill in your details to get started.
          </p>
        </div>

        {errorStatus && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3.5 rounded-xl font-semibold leading-relaxed">
            ⚠️ {errorStatus}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleOnboardingSubmit}>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-gray-400 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={identityEmail}
              onChange={(e) => setIdentityEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-gray-400 font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Country
            </label>
            <select
              value={targetMarketRegion}
              onChange={(e) => setTargetMarketRegion(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 cursor-pointer"
            >
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="KE">🇰🇪 Kenya</option>
              <option value="ET">🇪🇹 Ethiopia</option>
              <option value="AE">🇦🇪 UAE</option>
              <option value="SA">🇸🇦 Saudi Arabia</option>
              <option value="EG">🇪🇬 Egypt</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={securePassword}
              onChange={(e) => setSecurePassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-gray-400 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-gray-400 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Admin Code (optional)
            </label>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Leave empty for regular account"
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-gray-400 font-mono"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProvisioning}
              className={`w-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                isProvisioning ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isProvisioning ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
        <div
          className="text-center pt-4 border-t border-gray-100 text-[11px] font-medium text-gray-400"
          suppressHydrationWarning={true}
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-slate-800 hover:underline font-bold transition ml-1"
          >
            {currentT?.signIn || "Log In"}
          </Link>
        </div>
      </div>
    </div>
  );
}