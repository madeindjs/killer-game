import { useTranslation } from "../../utils/use-translation";

import packageJson from "../../../package.json";

export default function Footer() {
  const { t, lang } = useTranslation("common");

  return (
    <footer className="footer p-10 text-neutral-content">
      <nav>
        <p className="font-semibold">
          {t("appName")} - v{packageJson.version}
        </p>
        <header className="footer-title">{t("Footer.sitemap")}</header>
        <a className="link link-hover" href={`/${lang}/help`}>
          {t("Footer.help")}
        </a>
        <a className="link link-hover" href={`/${lang}/actions`}>
          {t("Footer.actions")}
        </a>
        <a className="link link-hover" href={`/${lang === "en" ? "fr" : "en"}`} hrefLang={"en" ? "fr" : "en"}>
          {t("Footer.switchLang")}
        </a>
      </nav>
      <nav>
        <header className="footer-title">{t("Footer.externalLinks")}</header>
        <a className="link link-hover" href="https://rsseau.fr">
          {t("Footer.aboutMe")}
        </a>
        {/* <a className="link link-hover" href="https://github.com/madeindjs/killer-game">
          {t("Footer.github")}
        </a> */}
      </nav>
    </footer>
  );
}
