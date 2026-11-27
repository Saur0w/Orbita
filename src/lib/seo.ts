import { getLocale, getMessages } from "next-intl/server";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbita.vercel.app";

export interface MetadataMessages {
  title: string;
  ogTitle: string;
  description: string;
  ogImageAlt: string;
  preorderTitle: string;
  preorderOgTitle: string;
  preorderDescription: string;
  preorderOgImageAlt: string;
}

interface FAQEntry {
  question: string;
  answer: string;
}

export interface SiteMessages {
  Metadata?: Partial<MetadataMessages>;
  FAQ?: {
    items?: Record<string, FAQEntry>;
  };
}

const FALLBACK_META: Record<"en" | "de", MetadataMessages> = {
  en: {
    title: "Orbita",
    ogTitle: "Orbita — Architectural Lighting",
    description:
      "Sculpted to shape the atmosphere of your space. Orbita unites minimal form, adaptive lighting, and precision craftsmanship.",
    ogImageAlt: "Orbita sculptural ambient lamp",
    preorderTitle: "Pre-order Orbital Lamp",
    preorderOgTitle: "Pre-order Orbital Lamp — Orbita",
    preorderDescription:
      "Reserve your Orbita Lamp in brushed Silver or anodized Gold (€800). Portable cordless architectural LED lighting with 12-hour USB-C battery life.",
    preorderOgImageAlt: "Orbita Lamp Gold edition pre-order preview",
  },
  de: {
    title: "Orbita",
    ogTitle: "Orbita — Architektonische Beleuchtung",
    description:
      "Entworfen, um die Atmosphäre Ihres Raumes zu formen. Orbita vereint zeitlose Form, intelligentes Licht und präzise Handwerkskunst.",
    ogImageAlt: "Orbita — Skulpturale Tischleuchte",
    preorderTitle: "Orbital Lamp vorbestellen",
    preorderOgTitle: "Orbital Lamp vorbestellen — Orbita",
    preorderDescription:
      "Reservieren Sie die Orbita Lamp in gebürstetem Silber oder eloxiertem Gold (€800). Kabellose LED-Tischleuchte mit bis zu 12 Stunden Akkulaufzeit.",
    preorderOgImageAlt: "Orbita Lamp Gold Vorschau zur Vorbestellung",
  },
};

/**
 * Resolves localized metadata strings and raw message payload for Server Components.
 */
export async function getSeoContext() {
  const locale = (await getLocale()) === "de" ? "de" : "en";
  const messages = (await getMessages()) as SiteMessages;
  const defaults = FALLBACK_META[locale];
  const msgMeta = messages?.Metadata;

  const meta: MetadataMessages = {
    title: msgMeta?.title ?? defaults.title,
    ogTitle: msgMeta?.ogTitle ?? defaults.ogTitle,
    description: msgMeta?.description ?? defaults.description,
    ogImageAlt: msgMeta?.ogImageAlt ?? defaults.ogImageAlt,
    preorderTitle: msgMeta?.preorderTitle ?? defaults.preorderTitle,
    preorderOgTitle: msgMeta?.preorderOgTitle ?? defaults.preorderOgTitle,
    preorderDescription:
      msgMeta?.preorderDescription ?? defaults.preorderDescription,
    preorderOgImageAlt:
      msgMeta?.preorderOgImageAlt ?? defaults.preorderOgImageAlt,
  };

  return {
    locale,
    isDe: locale === "de",
    ogLocale: locale === "de" ? "de_DE" : "en_US",
    alternateOgLocale: locale === "de" ? ["en_US"] : ["de_DE"],
    meta,
    messages,
  };
}

/**
 * Builds Schema.org Product JSON-LD for Orbita Lamp.
 */
export function buildProductJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Orbita Lamp",
    description,
    brand: {
      "@type": "Brand",
      name: "Orbita",
    },
    image: [`${SITE_URL}/images/og.jpg`, `${SITE_URL}/images/og-preorder.jpg`],
    url: `${SITE_URL}/preorder`,
    color: ["Silver", "Gold"],
    material: "Brushed Aluminum, Precision Steel Core",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/preorder`,
      priceCurrency: "EUR",
      price: "800",
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

/**
 * Serializes JSON-LD safely for inline HTML script tags.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
