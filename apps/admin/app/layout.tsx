import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RENTOCOSTUMES Admin",
  description: "Admin dashboard for RENTOCOSTUMES costumes rental system",
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
