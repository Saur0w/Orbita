import type { Metadata } from "next";
import PreorderClient from "./PreorderClient";
import {
  buildProductJsonLd,
  getSeoContext,
  serializeJsonLd,
  SITE_URL,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { meta, ogLocale, alternateOgLocale } = await getSeoContext();

  return {
    title: meta.preorderTitle,
    description: meta.preorderDescription,
    alternates: {
      canonical: "/preorder",
    },
    openGraph: {
      type: "website",
      siteName: "Orbita",
      url: "/preorder",
      title: meta.preorderOgTitle,
      description: meta.preorderDescription,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
      images: [
        {
          url: "/images/og-preorder.jpg",
          width: 1200,
          height: 630,
          alt: meta.preorderOgImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.preorderOgTitle,
      description: meta.preorderDescription,
      images: ["/images/og-preorder.jpg"],
    },
  };
}

export default async function PreorderPage() {
  const { meta } = await getSeoContext();

  const jsonLdGraph = [
    buildProductJsonLd(meta.preorderDescription),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Orbita",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: meta.preorderTitle,
          item: `${SITE_URL}/preorder`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />
      <PreorderClient />
    </>
  );
}
