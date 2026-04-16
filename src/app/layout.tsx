import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CursorEffect from "@/components/CursorEffect";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "FreshCart — Fresh Groceries Delivered",
  description: "Farm-fresh produce and everyday essentials delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-bg-100 text-slate-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <CursorEffect />
              <Navbar />
              <main>{children}</main>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
