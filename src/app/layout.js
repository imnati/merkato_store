import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import DocumentWrapper from "./DocumentWrapper";

// Next.js standard search engine optimization (SEO) config
export const metadata = {
  title: "Merkato Store",
  description: "Pan-African & Middle East Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <AppProvider>
      <LanguageProvider>
        <DocumentWrapper>{children}</DocumentWrapper>
      </LanguageProvider>
    </AppProvider>
  );
}
