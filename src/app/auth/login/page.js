"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [identityEmail, setIdentityEmail] = useState("");
  const [credentialPassword, setCredentialPassword] = useState("");
  const [errorStatusMessage, setErrorStatusMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticationSubmit = async (e) => {
    e.preventDefault();
    setErrorStatusMessage("");
    setIsAuthenticating(true);

    if (!identityEmail || !identityEmail.includes("@")) {
      setErrorStatusMessage(
        "Please enter a valid registered email address template.",
      );
      setIsAuthenticating(false);
      return;
    }

    if (!credentialPassword || credentialPassword.length < 6) {
      setErrorStatusMessage(
        "Secure credential signature token must span at least 6 characters.",
      );
      setIsAuthenticating(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (
        identityEmail.startsWith("admin") ||
        credentialPassword === "123456"
      ) {
        alert(
          "✓ Authentication Complete! Signed access token mapped securely onto active profile environment.",
        );
        window.location.href = "/";
      } else {
        setErrorStatusMessage(
          "Access Denied: Invalid security signature credentials matching parameters array.",
        );
      }
    } catch (err) {
      setErrorStatusMessage(
        "Connection timeout to user profile authorization router database.",
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 space-y-6 transition-all">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black font-mono tracking-tight text-slate-900 uppercase">
            Account Login
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Provide profile indicators to unlock multi-regional catalog nodes.
          </p>
        </div>

        {errorStatusMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3.5 rounded-xl font-semibold leading-relaxed">
            ⚠️ {errorStatusMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleAuthenticationSubmit}>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Account Email Address
            </label>

            <input
              type="email"
              value={identityEmail}
              onChange={(e) => setIdentityEmail(e.target.value)}
              placeholder="e.g. abebe@merkatostore.com"
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-gray-400 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
              Secure Credential Password
            </label>
            <input
              type="password"
              value={credentialPassword}
              onChange={(e) => setCredentialPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-gray-400 font-mono"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                isAuthenticating ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isAuthenticating ? (
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
                  <span>Verifying Encrypted Signature Token...</span>
                </>
              ) : (
                "Authorize Account Session"
              )}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2 pt-4 border-t border-gray-100 text-[11px] font-bold">
          <div>
            <Link
              href="/auth/forgot-password"
              className="text-orange-500 hover:text-orange-600 hover:underline transition"
            >
              Forgot Access Token / Password?
            </Link>
          </div>
          <div className="text-gray-400 font-medium">
            No profile configurations registered?{" "}
            <Link
              href="/auth/signup"
              className="text-slate-800 hover:text-slate-900 hover:underline transition font-bold"
            >
              Register Entry Node
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
