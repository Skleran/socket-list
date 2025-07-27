import { cookies, headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

export async function getUserLocale(): Promise<Locale> {
  // 1. Check for a locale cookie
  const cookieStore = cookies();
  const cookieLocale = (await cookieStore).get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Check Accept-Language header from the browser
  const headerLocale = (await headers())
    .get("Accept-Language")
    ?.split(",")[0]
    .split("-")[0]; // like 'en-US' => 'en'

  if (headerLocale && locales.includes(headerLocale as Locale)) {
    return headerLocale as Locale;
  }

  // 3. Fallback
  return defaultLocale;
}
