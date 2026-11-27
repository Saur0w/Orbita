import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import {
  buildProductJsonLd,
  getSeoContext,
  serializeJsonLd,
  SITE_URL,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { meta, ogLocale, alternateOgLocale } = await getSeoContext();

  return {
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: "Orbita",
      url: "/",
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
  };
}

export default async function HomePage() {
  const { meta, messages } = await getSeoContext();
  const faqEntries = Object.values(messages?.FAQ?.items ?? {});

  const jsonLdGraph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Orbita",
      url: SITE_URL,
      email: "hello@orbitalight.com",
      logo: `${SITE_URL}/images/og.jpg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Orbita",
      url: SITE_URL,
      description: meta.description,
    },
    buildProductJsonLd(meta.description),
    ...(faqEntries.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqEntries.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />
      <HomeClient />
    </>
  );
}
