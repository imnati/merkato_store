"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppEngine } from "@/context/AppContext";

export default function SecuritySignOutActionPage() {
  const router = useRouter();
  const { setUser, setOrderHistory, syncCart } = useAppEngine();

  useEffect(() => {
    const executeSecureSessionPurge = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        if (setUser) setUser(null);
        if (setOrderHistory) setOrderHistory([]);

        if (syncCart) syncCart([]);

        if (typeof window !== "undefined") {
          localStorage.removeItem("MERKATO_CART");
          localStorage.removeItem("MERKATO_REGION");

          localStorage.removeItem("MERKATO_AUTH_TOKEN");
        }

        console.log("🔒 Account Identity Session Token Cleared Successfully.");

        window.location.href = "/";
      } catch (err) {
        console.error("Session teardown error execution branch failure:", err);
        router.push("/");
      }
    };

    executeSecureSessionPurge();
  }, [setUser, setOrderHistory, syncCart, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4 text-center space-y-4 select-none">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-orange-600 animate-spin"></div>
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-black uppercase text-slate-900 font-mono tracking-wider">
          Securing Your Session Teardown
        </h2>
        <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
          Wiping localized security configuration matrices and routing your
          connection safely back onto the store timeline...
        </p>
      </div>
    </div>
  );
}
