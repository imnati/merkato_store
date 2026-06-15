"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [identityEmail, setIdentityEmail] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setErrorStatus("");
    setSuccessStatus(false);
    setLoading(true);

    if (!identityEmail || !identityEmail.includes("@")) {
      setErrorStatus(
        "Please provide a valid registered email address parameters array.",
      );
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessStatus(true);
    } catch (err) {
      setErrorStatus(
        "Connection timeout to the user identity security database cluster.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 space-y-6 transition-all">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black font-mono tracking-tight text-slate-900 uppercase">
            Reset Password
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Provide your account email to receive a recovery access token
            payload.
          </p>
        </div>

        {errorStatus && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3.5 rounded-xl font-semibold leading-relaxed">
            ⚠️ {errorStatus}
          </div>
        )}

        {successStatus ? (
          <div className="space-y-4 text-center animate-fade-in">
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-4 rounded-xl font-medium leading-relaxed">
              🎉 **Recovery Request Dispatched!** An automated security
              verification email payload has been routed to your communications
              log. Please inspect your inbox instructions to clear parameters.
            </div>
            <Link
              href="/auth/login"
              className="w-full inline-block bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl shadow-md transition-all text-center"
            >
              Return to Account Login Node
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleRecoverySubmit}>
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
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
                    <span>Dispatching Token Payload...</span>
                  </>
                ) : (
                  "Request Reset Link"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-4 border-t border-gray-100 text-[11px] font-bold">
          <Link
            href="/auth/login"
            className="text-gray-400 font-medium hover:text-slate-800 transition"
          >
            Remember security configurations?{" "}
            <span className="text-orange-500 font-bold hover:underline">
              Log In
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
