import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import packageJson from "../../../../package.json";

export default function Footer() {
  const t = useTranslations("common");
  const lang = useLocale();

  return (
    <footer className="footer p-10 text-neutral-content">
      <nav>
        <p className="font-semibold">
          {t("appName")} - v{packageJson.version}
        </p>
        <header className="footer-title">{t("Footer.sitemap")}</header>
        <Link className="link link-hover" href={`/${lang}/help`}>
          {t("Footer.help")}
        </Link>
        <Link className="link link-hover" href={`/${lang}/docs/ai`}>
          {t("Footer.aiDocs")}
        </Link>
        <Link className="link link-hover" href={`/${lang}/actions`}>
          {t("Footer.actions")}
        </Link>
        <Link className="link link-hover" href={`/${lang}/team-building`}>
          {t("Footer.teamBuilding")}
        </Link>
        <Link
          className="link link-hover"
          href={`/${lang === "en" ? "fr" : "en"}`}
          hrefLang={lang === "en" ? "fr" : "en"}
        >
          {t("Footer.switchLang")}
        </Link>
      </nav>
      <nav>
        <header className="footer-title">{t("Footer.externalLinks")}</header>
        <Link className="link link-hover" href="https://rsseau.fr">
          {t("Footer.aboutMe")}
        </Link>
        <Link
          className="link link-hover"
          href={
            process.env.NEXT_PUBLIC_API_URL
              ? `${process.env.NEXT_PUBLIC_API_URL}/docs`
              : "http://localhost:3001/docs"
          }
        >
          {t("Footer.apiDocs")}
        </Link>
      </nav>
    </footer>
  );
}
