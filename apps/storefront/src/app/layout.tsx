import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RENTOCOSTUMES — Premium Costumes Rental",
  description:
    "Luxury bridal costumes rental for weddings, receptions, and bridal shoots across Kerala. Premium pieces, sanitized and insured.",
  keywords: [
    "bridal costumes rental",
    "wedding costumes",
    "Kerala costumes rental",
    "RENTOCOSTUMES",
    "premium costumes",
  ],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

import MobileBottomNav from "@/components/home/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-silk-gradient selection:bg-rosegold/20 selection:text-rosegold-dark">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
