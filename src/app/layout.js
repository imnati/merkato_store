import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ToastProvider from "@/components/ToastProvider";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Merkato Store — Pan-African & Middle East Marketplace",
    template: "%s | Merkato Store",
  },
  description: "Shop across Africa and the Middle East. Electronics, fashion, groceries, beauty, and more with regional pricing and fast delivery.",
  keywords: ["marketplace", "e-commerce", "Africa", "Middle East", "shopping", "Nigeria", "Kenya", "Ethiopia", "UAE", "Saudi Arabia", "Egypt"],
  authors: [{ name: "Merkato Store" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://merkatostore.com",
    siteName: "Merkato Store",
    title: "Merkato Store — Pan-African & Middle East Marketplace",
    description: "Shop across Africa and the Middle East. Electronics, fashion, groceries, beauty, and more with regional pricing and fast delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merkato Store — Pan-African & Middle East Marketplace",
    description: "Shop across Africa and the Middle East. Electronics, fashion, groceries, beauty, and more.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={caveat.variable}>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col justify-between custom-scrollbar">
        <AppProvider>
          <LanguageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  );
}
