"use client";

import React from "react";

export default function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.error || new Error("Unknown error"));
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-black text-slate-900">Something went wrong</h2>
          <p className="text-xs text-gray-500 font-medium">
            {error?.message || "An unexpected error occurred. Please refresh the page."}
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.reload();
            }}
            className="w-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-black py-3 rounded-xl transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
}
