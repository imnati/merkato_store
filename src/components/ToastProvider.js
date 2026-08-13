"use client";

import React from "react";
import { Toaster } from "sonner";

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        duration={4000}
      />
    </>
  );
}
