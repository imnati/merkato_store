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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { t } = useTranslationEngine();
  const currentT = t || {};

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setErrorStatus("");
    setIsProvisioning(true);
    if (securePassword !== confirmPassword) {
      setErrorStatus(currentT.passwordsMismatch);
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
      setErrorStatus(err.response?.data?.message || currentT.registrationFailed);
    } finally {
      setIsProvisioning(false);
    }
  };

  if (successStatus) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden px-4 py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-1/5 w-96 h-96 rounded-full bg-orange-300/25 blur-3xl"
        />

        <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-300/40 p-8 sm:p-10 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50">
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-mono uppercase">
              {currentT.accountCreated}
            </h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              {currentT.accountCreatedBody}
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-block w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-700/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] text-center"
          >
            {currentT.goToLogin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      {/* Soft branded backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/5 w-96 h-96 rounded-full bg-orange-300/25 blur-3xl"
      />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-300/40 overflow-hidden animate-fade-in">
        {/* Brand Showcase Panel */}
        <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0B1528] via-[#112952] to-[#0A172E] text-white p-10 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl"
          />

          <div className="relative">
            <div className="flex items-center gap-2 select-none">
              <span className="text-2xl font-black font-mono tracking-tight">
                <span className="text-orange-500">{currentT.brandNamePart1 || "MERKATO"}</span>{" "}
                <span className="text-white">{currentT.brandNamePart2 || "STORE"}</span>
              </span>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-widest text-slate-400 font-mono font-bold">
              {currentT.marketplaceSubtitle}
            </p>
          </div>

          <div className="relative space-y-5">
            <h1 className="text-3xl xl:text-4xl font-black leading-tight font-mono uppercase tracking-tight">
              {currentT.joinThe}
              <span className="block text-emerald-400">{currentT.joinSuffix}</span>
            </h1>
            <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
              {currentT.signupBody}
            </p>

            <div className="flex flex-wrap gap-2.5 pt-3">
              {["🇳🇬", "🇰🇪", "🇪🇹", "🇦🇪"].map((flag) => (
                <span
                  key={flag}
                  className="text-[11px] font-bold font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
              {currentT.freeToJoin}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
              {currentT.sixHubs}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
              {currentT.logistics24h}
            </span>
          </div>
        </aside>

        {/* Sign-up Card */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto space-y-4">
            {/* Avatar badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-50">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
            </div>

            <header className="text-center space-y-0.5">
              <h2
                suppressHydrationWarning={true}
                className="text-xl font-black font-mono tracking-tight text-slate-900 uppercase"
              >
                {currentT?.signUp || "Create Account"}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {currentT.fillDetails}
              </p>
            </header>

            {errorStatus && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-semibold leading-relaxed flex items-start gap-2.5"
              >
                <svg
                  className="h-5 w-5 shrink-0 mt-0.5 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorStatus}</span>
              </div>
            )}

            <form className="space-y-3" onSubmit={handleOnboardingSubmit}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1"
                >
                  {currentT.fullName}
                </label>
                <div className="relative group">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={currentT.johnDoe}
                    autoComplete="name"
                    className="w-full bg-slate-50/60 border border-slate-200 text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium min-h-[48px]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1"
                >
                  {currentT.emailAddress}
                </label>
                <div className="relative group">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    id="signup-email"
                    type="email"
                    value={identityEmail}
                    onChange={(e) => setIdentityEmail(e.target.value)}
                    placeholder={currentT.emailPlaceholder}
                    autoComplete="email"
                    className="w-full bg-slate-50/60 border border-slate-200 text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium min-h-[48px]"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="signup-region"
                  className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1"
                >
                  {currentT.country}
                </label>
                <div className="relative group">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <select
                    id="signup-region"
                    value={targetMarketRegion}
                    onChange={(e) => setTargetMarketRegion(e.target.value)}
                    className="w-full appearance-none bg-slate-50/60 border border-slate-200 text-sm rounded-xl pl-11 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:bg-white transition-all text-slate-800 font-bold cursor-pointer min-h-[48px]"
                  >
                    <option value="NG">🇳🇬 Nigeria</option>
                    <option value="KE">🇰🇪 Kenya</option>
                    <option value="ET">🇪🇹 Ethiopia</option>
                    <option value="AE">🇦🇪 UAE</option>
                    <option value="SA">🇸🇦 Saudi Arabia</option>
                    <option value="EG">🇪🇬 Egypt</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1"
                >
{currentT.password}
                </label>
                <div className="relative group">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={securePassword}
                    onChange={(e) => setSecurePassword(e.target.value)}
                    placeholder={currentT.minPassword}
                    autoComplete="new-password"
                    className="w-full bg-slate-50/60 border border-slate-200 text-sm rounded-xl pl-11 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium min-h-[48px]"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="signup-confirm"
                  className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1"
                >
                  {currentT.confirmPassword}
                </label>
                <div className="relative group">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="signup-confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={currentT.confirmPasswordPlaceholder}
                    autoComplete="new-password"
                    className="w-full bg-slate-50/60 border border-slate-200 text-sm rounded-xl pl-11 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium min-h-[48px]"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showConfirm ? (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Code */}
              <div>
                <label
                  htmlFor="signup-admin"
                  className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1"
                >
                  {currentT.adminOptional}
                </label>
                <div className="relative group">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <input
                    id="signup-admin"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder={currentT.adminPlaceholder}
                    className="w-full bg-slate-50/60 border border-slate-200 text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium min-h-[48px]"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isProvisioning}
                  className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-700/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isProvisioning
                      ? "opacity-75 cursor-not-allowed hover:translate-y-0"
                      : ""
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
                      <span>{currentT.creatingAccount}</span>
                    </>
                  ) : (
                    currentT.createOne
                  )}
                </button>
              </div>
            </form>

            <footer
              className="text-center pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-400"
              suppressHydrationWarning={true}
            >
              {currentT.haveAccount}{" "}
              <Link
                href="/auth/login"
                className="text-slate-800 hover:underline font-bold transition ml-1"
              >
                {currentT?.logIn || "Log In"}
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}