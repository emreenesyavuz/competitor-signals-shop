import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import PixelScripts from "@/components/PixelScripts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SignalShop - Test E-Commerce Store",
  description: "A demo e-commerce store for testing conversion signal integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <PixelScripts />
        <CartProvider>
          <Navbar />
          <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
