import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "NIV'Pop — Kiosco",
  description: "Descubre qué nieve eres. Un test diseñado para revelar tu personalidad a través del sabor.",
  manifest: "/manifest.json",
  themeColor: "#16120d",
  appleWebApp: { capable: true, statusBarStyle: "black", title: "NIV'POP" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
