export const LANGS = ["en", "fr"];

export const DEFAULT_LANG = "en";

/**
 * @typedef {'en' | 'fr'} Lang
 */

export const TRANSLATIONS = {
  en: {
    APP_NAME: "Killer game",
    APP_NAME_LONG: "Killer game generator",
    HOME_HEADLINE: `Are you organizing an event and want everyone to get to know each other? You've come to the right place!`,
  },
  fr: {
    APP_NAME: "Jeu du Killer",
    APP_NAME_LONG: "Organise tes killer party",
    HOME_HEADLINE: `Tu organises un événement et tu veux que tout le monde apprenne à se connaître? Tu es au bon endroit!`,
  },
};

/**
 *
 * @param {typeof TRANSLATIONS['en']} lang
 * @returns
 */
export function i18n(lang) {
  if (lang === "fr") {
    return TRANSLATIONS.fr;
  } else {
    return TRANSLATIONS.en;
  }
}
