import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import LenisProvider from "@/components/Lenis";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Orbita Lamp — Modern Lighting & Design Objects",
  description:
      "Discover the inaugural lighting object by Orbita Studio. Precision engineering meets contemporary design. Explore the features and pre-order Batch 01.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
      <LenisProvider>
        {children}
      </LenisProvider>
      </body>
    </html>
  );
}
