import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const neueMontreal = localFont({
  src: "../../public/font/ppneuemontreal.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbita — Beyond Illumination",
  description:
    "Designed to shape the atmosphere of your space, Orbita Lamp combines timeless form, intelligent lighting, and premium craftsmanship.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${neueMontreal.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
