import { DEFAULT_LANG } from "@/lib/i18n";
import Link from "next/link";

/**
 * @typedef Props
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function Footer({ lang = DEFAULT_LANG }) {
  const translations = {
    en: {
      SITEMAP: "Sitemap",
      GITHUB: "Source code (Github)",
      HELP: "How does the killer game work?",
      ACTIONS: "Action list for a game of Killer",
      ABOUT_ME: "About me",
      SWITCH_LANG: "🇫🇷 Version française",
      EXTERNAL_LINKS: "External links",
    },
    fr: {
      SITEMAP: "Plan du site",
      GITHUB: "Code source (Github)",
      HELP: "How does the killer game work?",
      ACTIONS: "Action list for a game of Killer",
      ABOUT_ME: "A propos de moi",
      SWITCH_LANG: "🇬🇧 English version",
      EXTERNAL_LINKS: "Liens externes",
    },
  };
  const t = translations[lang];

  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <nav>
        <header className="footer-title">{t.SITEMAP}</header>
        <Link className="link link-hover" href={`/${lang}/help`}>
          {t.HELP}
        </Link>
        <Link className="link link-hover" href={`/${lang}/actions`}>
          {t.ACTIONS}
        </Link>
        <Link className="link link-hover" href={`/${lang === "en" ? "fr" : "en"}`}>
          {t.SWITCH_LANG}
        </Link>
      </nav>
      <nav>
        <header className="footer-title">{t.EXTERNAL_LINKS}</header>
        <Link className="link link-hover" href="https://rsseau.fr">
          {t.ABOUT_ME}
        </Link>
        <Link className="link link-hover" href="https://github.com/madeindjs/killer-game">
          {t.GITHUB}
        </Link>
      </nav>
    </footer>
  );
}
