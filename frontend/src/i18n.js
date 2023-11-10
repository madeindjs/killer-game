import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));

export const DEFAULT_LOCALE = "en";
export const LOCALES = [DEFAULT_LOCALE, "fr"];
