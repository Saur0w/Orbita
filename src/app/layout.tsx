import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueMontrealBold = localFont({
  src: "../../public/font/NeueMontreal-bold.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
});

const neueMontrealMedium = localFont({
  src: "../../public/font/NeueMontreal-Medium.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
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
      className={`${neueMontrealBold.variable} ${neueMontrealMedium.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
