import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ETERNITY — A Cinematic Birthday Experience",
  description: "Every beautiful story has a person who makes it unforgettable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-[#0B0B0D] text-[#EDEDED] font-sans antialiased selection:bg-[#D6B779]/30 selection:text-[#F5F0E8] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

