import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextileShop — Premium Quality Fabrics",
  description: "Discover our curated collection of premium quality fabrics. Cotton, Silk, Linen, Denim and more. Free shipping on orders over $100.",
  keywords: "textiles, fabrics, cotton, silk, linen, denim, fashion fabrics, textile shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
