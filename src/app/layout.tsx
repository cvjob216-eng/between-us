import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ALL_FONT_VARIABLES } from "@/lib/fonts";
import { AppProvider } from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "بين الرسائل – Between Letters",
  description:
    "Private romantic vintage letter correspondence for two hearts — The Art of Waiting.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "بين الرسائل",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", type: "image/svg+xml", sizes: "192x192" },
      { url: "/icons/icon-512.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    apple: "/icons/icon-512.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#783B43",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={ALL_FONT_VARIABLES}>
      <body className="antialiased selection:bg-[#783B43]/20 selection:text-[#35271F]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
