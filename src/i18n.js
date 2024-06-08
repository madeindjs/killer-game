/*
module.exports = {
  locales: ["en", "fr"],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/[lang]": ["common", "homepage", "actions"],
    "/[lang]/about": ["common", "about"],
    "/[lang]/help": ["common", "faq-for-player", "help", "actions"],
    "/[lang]/games": ["common", "games-created", "actions"],
    "/[lang]/actions": ["common", "actions", "homepage"],
    "/[lang]/games/[id]": ["common", "games", "toast", "game-dashboard"],
    "/[lang]/games/[id]/join": ["common", "games", "toast", "game-join"],
    "/[lang]/players/[id]": ["common", "player-dashboard", "toast"],
  },
};
*/

import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
const locales = ["en", "fr"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
