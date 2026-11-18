import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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

const neueMontrealRegular = localFont({
  src: "../../public/font/NeueMontreal-Regular.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orbita — Beyond Illumination",
  description:
    "Designed to shape the atmosphere of your space, Orbita Lamp combines timeless form, intelligent lighting, and premium craftsmanship.",
};

export default  async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${neueMontrealBold.variable} ${neueMontrealMedium.variable} ${neueMontrealRegular.variable}`}
      >
        <body>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
