import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "de"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    const locale: SupportedLocale =
        cookieLocale && (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)
            ? (cookieLocale as SupportedLocale)
            : "en";

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});