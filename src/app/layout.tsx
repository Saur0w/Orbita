import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { getSeoContext, SITE_URL } from "@/lib/seo";

const neueMontreal = localFont({
  src: [
    {
      path: "../../public/font/NeueMontreal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/NeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/NeueMontreal-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080809",
};

export async function generateMetadata(): Promise<Metadata> {
  const { ogLocale, alternateOgLocale, meta } = await getSeoContext();

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "Orbita",
    title: {
      default: meta.title,
      template: "%s — Orbita",
    },
    description: meta.description,
    keywords: [
      "Orbita",
      "Orbita Lamp",
      "architectural lighting",
      "luxury table lamp",
      "minimalist lamp",
      "ambient lighting",
    ],
    authors: [{ name: "Orbita" }],
    creator: "Orbita",
    publisher: "Orbita",
    category: "Industrial Design",
    openGraph: {
      type: "website",
      siteName: "Orbita",
      title: meta.ogTitle,
      description: meta.description,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
      images: [
        {
          url: "/images/og.jpg",
          width: 1200,
          height: 630,
          alt: meta.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.description,
      images: ["/images/og.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ViewTransitions>
      <html lang={locale} className={neueMontreal.variable}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
